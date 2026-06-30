const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = {};

  if (!username || username.trim() === '') {
    errors.username = 'Username is required';
  } else if (username.length < 3 || username.length > 30) {
    errors.username = 'Username must be between 3 and 30 characters';
  }

  if (!email || email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validatePost = (req, res, next) => {
  const { title, content } = req.body;
  const errors = {};

  if (!title || title.trim() === '') {
    errors.title = 'Title is required';
  } else if (title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (!content || content.trim() === '') {
    errors.content = 'Content is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateComment = (req, res, next) => {
  const { content } = req.body;
  const errors = {};

  if (!content || content.trim() === '') {
    errors.content = 'Comment content is required';
  } else if (content.length > 500) {
    errors.content = 'Comment content cannot exceed 500 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title } = req.body;
  const errors = {};

  if (!title || title.trim() === '') {
    errors.title = 'Task title is required';
  } else if (title.length < 3 || title.length > 200) {
    errors.title = 'Title must be between 3 and 200 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePost,
  validateComment,
  validateTask,
};
