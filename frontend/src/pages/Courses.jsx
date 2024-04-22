import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import CourseCard from '../components/CourseCard';

export default function Courses() {
  const [courses, setCourses] = useState([]); // State Variable For Storing Courses

  // Fetch Courses When Component Mounts
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch('/api/course/getCourses');
      const data = await res.json();
      setCourses(data.courses);
    };
    fetchCourses();
  }, []);
  return (
    <div>
      {/* Top Section */}
      <div className='flex flex-col gap-6 my-10 px-3 max-w-6xl mx-auto '>
        <div className='flex felx-row'>
          <img src={logo} className="h-50 w-60 rounded-lg mr-10" alt="Stark Logo" />
          <h1 className='uppercase my-auto mr-auto text-teal-500 text-5xl  font-serif'>Faculty of Computing...</h1>
        </div>
        <p className='text-stone-500'>
        Welcome to the faculty of computing. The STARK Faculty of Computing is equipped with a range of courses specialising in 
        various arms of the IT sector. Students are able to choose a path that is most in line with their requirements, allowing 
        them to pursue substantial careers in their selected field. Combined with an in-house lecturer panel, expansive computer 
        laboratories and hands-on learning, STARK provides its Faculty of Computing students with the ideal environment to develop 
        their computing skills.
        </p>
        <p className='text-stone-500'>
        Our computing degrees are awarded by STARK as approved by the University Grants Commission. The institute is also a Member 
        of the Association of Commonwealth Universities and International Association of Universities (IAU). Students have the 
        option of studying the Bla Bla Bla University Offshore programmers in Sri Lanka right here at STARK. Students can also 
        complete their degree at one of STARK’s partner universities in UK, USA, Canada and Australia.
        </p>
        
      </div>
      
      {/* Recent Courses Section */}
      <div className='max-w-6xl mx-auto pb-3 flex flex-col'>
        {/* Render Recent Courses If Available */}
        {courses && courses.length > 0 && (
          <div className='flex flex-col mb-3'>
            <hr className=" border-zinc-950 dark:border-orange-400" />
            <h1 className='text-xl p-2 uppercase text-cyan-500 font-serif'>Available Courses</h1>
            <hr className=" border-zinc-950 dark:border-orange-400 mb-5" />
            <div className='flex flex-wrap gap-4 '>
              {/* Map Through Courses And Render CourseCard For Each */}
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}