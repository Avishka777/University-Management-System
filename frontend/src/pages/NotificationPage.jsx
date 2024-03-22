import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NotificationCard from '../components/NotificationCard';

export default function NotificationPage() {
  const { notificationSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/notification/getnotifications?slug=${notificationSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setNotification(data.notifications[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchNotification();
  }, [notificationSlug]);

  useEffect(() => {
    try {
      const fetchRecentNotifications = async () => {
        const res = await fetch(`/api/notification/getnotifications?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentNotifications(data.notifications);
        }
      };
      fetchRecentNotifications();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
    <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{notification && notification.title}</h1>
    <Link to={`/search?category=${notification && notification.category}`} className='self-center mt-5'>
    <Button color='gray' pill size='xs'>{notification && notification.category}</Button>
    </Link>
    <img src={notification && notification.image} alt={notification && notification.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
    <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{notification && new Date(notification.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{notification && (notification.content.length /1000).toFixed(0)} mins read</span>
    </div>
    <div className='p-3 max-w-2xl mx-auto w-full notification-content' dangerouslySetInnerHTML={{__html: notification && notification.content}}>

    </div>

    <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent Notification</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentNotifications &&
            recentNotifications.map((notification) => <NotificationCard key={notification._id} notification={notification} />)}
        </div>
      </div>

  </main>;
}