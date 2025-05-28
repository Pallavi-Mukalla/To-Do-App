const Task = require('../models/Task');

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const { title } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newTask = new Task({
      userId: req.user.userId, 
      title,
      imageUrl
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task' });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 }); 
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id, userId: req.user.userId }); 
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Mark a task as complete
exports.markAsComplete = async (req, res) => {
  try {
    console.log('Mark as complete called for task id:', req.params.id);
    console.log('User ID:', req.user.userId);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { completed: true },
      { new: true }
    );

    if (!task) {
      console.log('Task not found or not authorized');
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error('Mark as complete error:', err);
    res.status(500).json({ error: 'Failed to mark task as complete' });
  }
};


// Delete all completed tasks
exports.deleteCompletedTasks = async (req, res) => {
  try {
    await Task.deleteMany({ userId: req.user.userId, completed: true }); 
    res.json({ message: 'All completed tasks deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete completed tasks' });
  }
};
