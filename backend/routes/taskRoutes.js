const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware'); 
const taskController = require('../controllers/taskController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.delete('/completed', auth, taskController.deleteCompletedTasks);

router.get('/', auth, taskController.getTasks);
router.post('/', auth, upload.single('image'), taskController.addTask);
router.delete('/:id', auth, taskController.deleteTask);
router.patch('/:id/complete', auth, taskController.markAsComplete);

module.exports = router;
