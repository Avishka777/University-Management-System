import { Link } from 'react-router-dom';
import React from 'react';

export default function CourseCard({ course }) {
  
  // Render The Course Card
  return (
    <div className='border border-teal-500 hover:border-2 overflow-hidden rounded-lg transition-all h-[40px] w-[460px] flex flex-row '>      
      {/* Course Details */}
        <div className='gap-2 ml-3 mr-3 mt-2'>
        <Link to={`/course/${course.slug}`}>
          <div className='flex flex-row'>
            {/* Course Code and Name */}
            <span className='text-lg font-semibold text-gray-500'>{(course.courseCode)}</span>
            <h1 className='ml-2 mr-2 text-gray-500 '>|</h1>
            <span className='text-lg font-semibold'>{(course.courseName)}</span>
          </div>
        </Link>        
      </div>
    </div>

  );
}
