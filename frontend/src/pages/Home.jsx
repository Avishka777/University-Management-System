import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AnnouncementCard from '../components/AnnouncementCard';
import logo from '../assets/logo.png';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]); // State Variable For Storing Announcements

  // Fetch Announcements When Component Mounts
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await fetch('/api/announcement/getAnnouncements');
      const data = await res.json();
      setAnnouncements(data.announcements);
    };
    fetchAnnouncements();
  }, []);
  return (
    <div>
      {/* Top Section */}
      <div className='flex flex-col gap-6 mt-10 mb-10 px-3 max-w-6xl mx-auto '>
      <div className='flex felx-row'>
          <img src={logo} className="h-50 w-60 rounded-lg mr-10" alt="Stark Logo" />
          <h1 className='uppercase my-auto mr-auto text-cyan-500 text-5xl  font-serif'>The Future...</h1>
      </div>
      <p className='text-stone-500'>
        We are a leading non-state higher education institute approved by the University Grants Commission (UGC) under the Universities Act. 
        We are members of the Association of Commonwealth Universities (ACU), as well as the International Association of Universities (IAU). 
        We are also the first Sri Lankan institute to be accredited by the Institute of Engineering & Technology( IET), UK and Engineering Council, UK.
      </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-cyan-500 font-bold hover:underline'
        >
          View all Announcements
        </Link>
      </div>
      
      {/* Recent Announcements Section */}
      <div className='max-w-6xl mx-auto flex flex-col gap-8'>
        {/* Render Recent Announcements If Available */}
        {announcements && announcements.length > 0 && (
          <div className='flex flex-col'>
            <hr className=" border-zinc-950 dark:border-orange-400" />
            <span className='text-xl p-2 uppercase text-cyan-500 font-serif'>Available Courses</span>
            <hr className=" border-zinc-950 dark:border-orange-400 mb-5" />
            <div className='flex flex-wrap gap-4'>
              {/* Map Through Announcements And Render AnnouncementCard For Each */}
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement._id} announcement={announcement} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-cyan-500 hover:underline text-center uppercase mb-10 mt-5'
            >
              {/* Link To View All Announcements */}
              View all Announcements
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}