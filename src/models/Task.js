const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task user reference is required'],
    },
    category: {
      type: String,
      enum: {
        values: ['work', 'personal', 'shopping', 'health', 'other'],
        message: '{VALUE} is not a valid category',
      },
      default: 'personal',
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for query performance optimization
taskSchema.index({ user: 1, completed: 1 });
taskSchema.index({ dueDate: 1 });

// Pre-save middleware to capitalize the first letter of the task title
taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
