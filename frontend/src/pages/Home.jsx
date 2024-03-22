import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotificationCard from '../components/NotificationCard';

export default function Home() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch('/api/notification/getNotifications');
      const data = await res.json();
      setNotifications(data.notifications);
    };
    fetchNotifications();
  }, []);
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>The Future</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
        We are a leading non-state higher education institute approved by the University Grants Commission (UGC) under the Universities Act. 
        We are members of the Association of Commonwealth Universities (ACU), as well as the International Association of Universities (IAU). 
        We are also the first Sri Lankan institute to be accredited by the Institute of Engineering & Technology( IET), UK and Engineering Council, UK.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all Notifications
        </Link>
      </div>


      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {notifications && notifications.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Notifications</h2>
            <div className='flex flex-wrap gap-4'>
              {notifications.map((notification) => (
                <NotificationCard key={notification._id} notification={notification} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all Notifications
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}