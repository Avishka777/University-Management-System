import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    courseDescription: {
        type: String,
        required: true,
      },
    courseCredit: {
      type: String,
    },
    courseFaculty: {
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

const Course = mongoose.model('Course', courseSchema);

export default Course;