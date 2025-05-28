require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const auth = require('./middleware/authMiddleware');
const { signup, login } = require('./controllers/authController');
const { addTask, getTasks, deleteTask } = require('./controllers/taskController');
const taskRoutes = require('./routes/taskRoutes');

const cors = require('cors');
app.use(cors({
  origin: 'https://To-Do-App.onrender.com', 
  credentials: true,
}));


const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/tasks', auth, taskRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"));

app.post('/api/signup', signup);
app.post('/api/login', login);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
