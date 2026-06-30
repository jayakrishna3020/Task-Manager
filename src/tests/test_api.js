const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Mock data stores
const mockUsers = [];
const mockTasks = [];

// Helper to make chainable mock Mongoose queries
const makeMockQuery = (result) => {
  const query = {
    populate: function () { return this; },
    sort: function () { return this; },
    skip: function () { return this; },
    limit: function () { return this; },
    then: function (resolve, reject) {
      return Promise.resolve(result).then(resolve, reject);
    },
  };
  return query;
};

// 1. Mock mongoose connection
mongoose.connect = async () => {
  console.log('\x1b[36m[MOCK DB] MongoDB Mock Connection Established\x1b[0m');
  return { connection: { host: 'in-memory-mock-tasks-db' } };
};

// 2. Mock User Schema and Model Methods
const User = require('../models/User');

User.findOne = (query) => {
  const user = mockUsers.find((u) => {
    if (query.email && u.email === query.email) return true;
    if (query.username && u.username === query.username) return true;
    return false;
  });

  const chainable = {
    select: function () { return this; },
    then: function (resolve) { return Promise.resolve(user).then(resolve); },
  };
  return chainable;
};

User.create = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  const newUser = {
    _id: 'mock_user_' + Math.random().toString(36).substr(2, 9),
    username: data.username,
    email: data.email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    comparePassword: async function (candidate) {
      return bcrypt.compare(candidate, this.password);
    },
  };
  mockUsers.push(newUser);
  return newUser;
};

User.findById = (id) => {
  const user = mockUsers.find((u) => u._id.toString() === id.toString());
  return makeMockQuery(user);
};

// 3. Mock Task Model Methods
const Task = require('../models/Task');

Task.create = async (data) => {
  // Simulate schema title pre-save capitalization
  let formattedTitle = data.title;
  if (formattedTitle) {
    formattedTitle = formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);
  }

  const newTask = {
    _id: 'mock_task_' + Math.random().toString(36).substr(2, 9),
    title: formattedTitle,
    description: data.description || '',
    completed: data.completed !== undefined ? data.completed : false,
    priority: data.priority || 'medium',
    category: data.category || 'personal',
    dueDate: data.dueDate,
    user: data.user,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTasks.push(newTask);
  return newTask;
};

Task.find = (query) => {
  let tasks = [...mockTasks];

  // Filter by user
  if (query.user) {
    tasks = tasks.filter((t) => t.user.toString() === query.user.toString());
  }

  // Filter by completed status
  if (query.completed !== undefined) {
    tasks = tasks.filter((t) => t.completed === query.completed);
  }

  // Filter by priority
  if (query.priority) {
    tasks = tasks.filter((t) => t.priority === query.priority);
  }

  // Filter by category
  if (query.category) {
    tasks = tasks.filter((t) => t.category === query.category);
  }

  return makeMockQuery(tasks);
};

Task.findById = (id) => {
  const task = mockTasks.find((t) => t._id.toString() === id.toString());
  if (!task) return makeMockQuery(null);

  const taskInstance = {
    ...task,
    save: async function () {
      const idx = mockTasks.findIndex((t) => t._id.toString() === this._id.toString());
      if (idx !== -1) {
        // Capitalize title if updated
        if (this.title) {
          this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
        }

        mockTasks[idx] = {
          _id: this._id,
          title: this.title,
          description: this.description,
          completed: this.completed,
          priority: this.priority,
          category: this.category,
          dueDate: this.dueDate,
          user: this.user,
          createdAt: this.createdAt,
          updatedAt: new Date().toISOString(),
        };
      }
      return this;
    },
  };
  return makeMockQuery(taskInstance);
};

Task.countDocuments = (query) => {
  let count = mockTasks.length;
  if (query.user) {
    count = mockTasks.filter((t) => t.user.toString() === query.user.toString()).length;
  }
  return Promise.resolve(count);
};

Task.deleteOne = (query) => {
  const idx = mockTasks.findIndex((t) => t._id.toString() === query._id.toString());
  if (idx !== -1) {
    mockTasks.splice(idx, 1);
  }
  return Promise.resolve({ deletedCount: 1 });
};

// Start the Express server on test port 3001
process.env.PORT = 3001;
process.env.NODE_ENV = 'test';
require('../../server');

// Integration tests execution
setTimeout(async () => {
  console.log('\n\x1b[1m\x1b[34m============================================');
  console.log('🏁 RUNNING TASK MANAGER API INTEGRATION TESTS');
  console.log('============================================\x1b[0m\n');

  const baseUrl = 'http://localhost:3001';
  let jwtToken = '';
  let taskId = '';
  let testsFailed = 0;
  let testsPassed = 0;

  const runTest = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ \x1b[32mPASS\x1b[0m: ${name}`);
      testsPassed++;
    } catch (err) {
      console.error(`❌ \x1b[31mFAIL\x1b[0m: ${name}`);
      console.error(`   Reason: ${err.message}`);
      testsFailed++;
    }
  };

  // Test 1: Health Check Endpoint
  await runTest('Health Check /api/health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    if (data.status !== 'ok') throw new Error(`Status body field was ${data.status}`);
  });

  // Test 2: Register User
  await runTest('Register New User /api/auth/register', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'coder_jay',
        email: 'jay@example.com',
        password: 'password123',
      }),
    });
    const data = await res.json();
    if (res.status !== 201) throw new Error(`Status ${res.status}: ${JSON.stringify(data)}`);
    if (!data.token) throw new Error('JWT Token not received');
    jwtToken = data.token;
  });

  // Test 3: Prevent duplicate email registration
  await runTest('Prevent Duplicate Email Registration', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'coder_jay2',
        email: 'jay@example.com',
        password: 'password123',
      }),
    });
    const data = await res.json();
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // Test 4: Login User
  await runTest('Login User /api/auth/login', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'jay@example.com',
        password: 'password123',
      }),
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    jwtToken = data.token;
  });

  // Test 5: Get Profile (Protected)
  await runTest('Get User Profile /api/auth/profile', async () => {
    const res = await fetch(`${baseUrl}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (data.data.username !== 'coder_jay') throw new Error('Username mismatch');
  });

  // Test 6: Create Task (Protected & verify title capitalization)
  await runTest('Create Task with Capitalized Title', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        title: 'write API testing suites', // Starts with lowercase 'w'
        description: 'Verify all database schema endpoints',
        priority: 'high',
        category: 'work',
      }),
    });
    const data = await res.json();
    if (res.status !== 201) throw new Error(`Status ${res.status}: ${JSON.stringify(data)}`);
    if (data.data.title !== 'Write API testing suites') {
      throw new Error(`Expected title capitalization, got: '${data.data.title}'`);
    }
    taskId = data.data._id;
  });

  // Test 7: Prevent Unauthenticated Task Creation (expected 401)
  await runTest('Prevent Unauthenticated Task Creation', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unauthorised task',
      }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // Test 8: Get All Tasks (Paginated)
  await runTest('Get Tasks Paginated /api/tasks', async () => {
    const res = await fetch(`${baseUrl}/api/tasks?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (data.count === 0) throw new Error('Task count is 0');
    if (data.pagination.limit !== 5) throw new Error('Pagination limit mismatch');
  });

  // Test 9: Get Tasks with Filter options
  await runTest('Get Tasks with Filter Options', async () => {
    const res = await fetch(`${baseUrl}/api/tasks?completed=false&priority=high`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (data.data.length === 0) throw new Error('No high priority active tasks returned');
  });

  // Test 10: Get Task by ID
  await runTest('Get Single Task by ID /api/tasks/:id', async () => {
    const res = await fetch(`${baseUrl}/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (data.data.title !== 'Write API testing suites') throw new Error('Task title mismatch');
  });

  // Test 11: Update Task (Complete the task)
  await runTest('Update Task to Completed', async () => {
    const res = await fetch(`${baseUrl}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        completed: true,
        priority: 'medium',
      }),
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(data)}`);
    if (data.data.completed !== true) throw new Error('Failed to set completed to true');
    if (data.data.priority !== 'medium') throw new Error('Failed to update priority');
  });

  // Test 12: Delete Task (Protected)
  await runTest('Delete Task by ID', async () => {
    const res = await fetch(`${baseUrl}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!data.success) throw new Error('Response success flag is false');
  });

  console.log('\n\x1b[1m\x1b[34m============================================');
  console.log('📊 TASK MANAGER TEST RESULTS');
  console.log(`   Passed: \x1b[32m${testsPassed}\x1b[0m / ${testsPassed + testsFailed}`);
  console.log(`   Failed: \x1b[31m${testsFailed}\x1b[0m`);
  console.log('============================================\x1b[0m\n');

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}, 1000);
