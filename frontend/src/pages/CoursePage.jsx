import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';

export default function CoursePage() {

  const { courseSlug } = useParams(); // Extracting CourseSlug From URL Params
  const [loading, setLoading] = useState(true); // State Variable For Loading State
  const [error, setError] = useState(false); // State Variable For Error State
  const [course, setCourse] = useState(null); // State Variable For Storing Course Data
  const [recentCourses, setRecentCourses] = useState(null); // State Variable For Storing Recent Courses Data

  // Fetch Course Data When CourseSlug Changes
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/course/getcourses?slug=${courseSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setCourse(data.courses[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseSlug]);

  // Fetch Recent Courses Data
  useEffect(() => {
    try {
      const fetchRecentCourses = async () => {
        const res = await fetch(`/api/course/getcourses?limit=10`);
        const data = await res.json();
        if (res.ok) {
          setRecentCourses(data.courses);
        }
      };
      fetchRecentCourses();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  // Render Spinner While Loading
  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  // Render Course Content
  return (
    <main className='flex flex-col max-w-6xl mx-auto min-h-screen'>
      <div className="flex justify-center mt-10 border-b border-orange-400 mx-auto w-full max-w-6xl text-xs"></div>
        <h1 className='text-xl p-2 text-center mx-auto lg:text-2xl uppercase text-cyan-500 font-serif'>{course && course.courseCode} | {course && course.courseName}</h1>
        <div className="flex justify-center border-b border-orange-400 mx-auto w-full max-w-6xl text-xs"></div>
      
      <div className='justify-between flex flex-row mt-2 mx-2'>
        <span className='text-lg text-gray-400'>{course && new Date(course.createdAt).toLocaleDateString()}</span>
        <span className='text-lg text-gray-400 font-serif uppercase'>Credit Points : {course && course.courseCredit}</span>
      </div>

      <div className='flex flex-col mt-6 mx-2'>
        <h1 className='text-lg text-gray-500'>Course Description</h1>
        <p className='text-sm mt-2 '>{course && course.courseDescription}</p>
      </div>

      <div className='flex flex-col mt-6 mx-2'>
        <h1 className='text-lg text-gray-500'>Assign Faculty</h1>
        <p className='text-sm mt-2 '>{course && course.enrolledfaculty}</p>
      </div>

      <div className='flex flex-col justify-center items-center mt-5 mx-auto max-w-6xl'>
        <div className="border-b border-orange-400 mx-auto w-full max-w-6xl text-xs"></div>
        <h1 className='text-xl p-2 uppercase text-cyan-500 font-serif'>Available Course</h1>
        <div className="border-b border-orange-400 mx-auto w-full max-w-6xl text-xs"></div>
          <h1 className='text-2xl mt-5 mb-2 uppercase'></h1>
            {/* Render Recent Courses */}
            <div className='flex flex-wrap gap-4 mb-10'>
              {recentCourses && recentCourses.map((course) => <CourseCard key={course._id} course={course} />)}
            </div>
          </div>
    </main>
)}