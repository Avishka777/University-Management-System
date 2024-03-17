import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:"https://firebasestorage.googleapis.com/v0/b/mern-university-management.appspot.com/o/Notification.jpg?alt=media&token=9eb798f9-4c06-4d7f-b16c-2c032e4f205b",
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;