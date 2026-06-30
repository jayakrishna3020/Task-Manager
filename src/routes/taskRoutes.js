const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management CRUD, pagination, and filtering
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minimum: 3
 *                 maximum: 200
 *                 example: Complete project documentation
 *               description:
 *                 type: string
 *                 maximum: 1000
 *                 example: Draft structural layouts and ER schemas for Week 10
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               category:
 *                 type: string
 *                 enum: [work, personal, shopping, health, other]
 *                 example: work
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-05T12:00:00Z
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, validateTask, createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get tasks with pagination, filtering, and sorting
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: string
 *         description: Filter tasks by completed status (true/false)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter tasks by priority (low/medium/high)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter tasks by category (work/personal/shopping/health/other)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Page limit size
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get specific task details
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task details retrieved successfully
 *       403:
 *         description: Forbidden (Not the task owner)
 *       404:
 *         description: Task not found
 */
router.get('/:id', protect, getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task attributes
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project documentation (updated)
 *               description:
 *                 type: string
 *                 example: Updated description details
 *               completed:
 *                 type: boolean
 *                 example: true
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               category:
 *                 type: string
 *                 enum: [work, personal, shopping, health, other]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.put('/:id', protect, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.delete('/:id', protect, deleteTask);

module.exports = router;
