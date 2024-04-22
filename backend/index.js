const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.route.js');
const authRoutes = require('./routes/auth.route.js');
const announcementRoutes = require('./routes/announcement.route.js');
const courseRoutes = require('./routes/course.route.js');
const timetableRoutes = require('./routes/timetable.route.js');
const notificationRoutes = require('./routes/notification.route.js');
const bookingRoutes = require('./routes/classroom.route.js');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDB is Connected.');
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
  console.log('Server is Running on Port 3000!');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/classroom', bookingRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/notification', notificationRoutes);

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error.';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

module.exports = app;