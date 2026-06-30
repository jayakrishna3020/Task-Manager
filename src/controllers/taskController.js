const Task = require('../models/Task');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, category } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      category,
      user: req.userId, // Populated by JWT authentication middleware
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks for authenticated user (with pagination, filtering, and sorting)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, completed, priority, category } = req.query;

    // Filter tasks by active user
    const filter = { user: req.userId };

    // Apply filtering options
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    if (priority) {
      filter.priority = priority;
    }

    if (category) {
      filter.category = category;
    }

    // Convert pagination queries to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch tasks sorting newest first
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total task count for pagination metadata
    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      count: tasks.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task details by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate ownership
    const taskOwnerId = task.user._id ? task.user._id.toString() : task.user.toString();
    if (taskOwnerId !== req.userId.toString()) {
      return res.status(403).json({ error: 'User is not authorized to view this task' });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate ownership
    const taskOwnerId = task.user._id ? task.user._id.toString() : task.user.toString();
    if (taskOwnerId !== req.userId.toString()) {
      return res.status(403).json({ error: 'User is not authorized to update this task' });
    }

    const { title, description, completed, priority, dueDate, category } = req.body;

    // Apply updates
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (category !== undefined) task.category = category;

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate ownership
    const taskOwnerId = task.user._id ? task.user._id.toString() : task.user.toString();
    if (taskOwnerId !== req.userId.toString()) {
      return res.status(403).json({ error: 'User is not authorized to delete this task' });
    }

    await Task.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
