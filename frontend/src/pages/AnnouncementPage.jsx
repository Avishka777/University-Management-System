import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnnouncementCard from '../components/AnnouncementCard';

export default function AnnouncementPage() {

  const { announcementSlug } = useParams(); // Extracting AnnouncementSlug From URL Params
  const [loading, setLoading] = useState(true); // State Variable For Loading State
  const [error, setError] = useState(false); // State Variable For Error State
  const [announcement, setAnnouncement] = useState(null); // State Variable For Storing Announcement Data
  const [recentAnnouncements, setRecentAnnouncements] = useState(null); // State Variable For Storing Recent Announcements Data

  // Fetch Announcement Data When AnnouncementSlug Changes
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/announcement/getannouncements?slug=${announcementSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setAnnouncement(data.announcements[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [announcementSlug]);

  // Fetch Recent Announcements Data
  useEffect(() => {
    try {
      const fetchRecentAnnouncements = async () => {
        const res = await fetch(`/api/announcement/getannouncements?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentAnnouncements(data.announcements);
        }
      };
      fetchRecentAnnouncements();
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

  // Render Announcement Content
  return (
    <main className='flex flex-col mx-auto min-h-screen mt-10 max-w-6xl mb-10'>
      <hr className=" border-zinc-950 dark:border-orange-400" />
      <h1 className='text-xl p-2 uppercase text-cyan-500 font-serif mx-auto'>{announcement && announcement.title}</h1>
      <hr className=" border-zinc-950 dark:border-orange-400" />

      <div className="flex justify-between p-3 w-full max-w-6xl text-xs text-gray-400">
        <span className='text-lg mt-2 uppercase text-gray-400'>{announcement && new Date(announcement.createdAt).toLocaleDateString()}</span>
        <span className='text-lg mt-2 font-serif text-gray-400 uppercase'>Category :{announcement && announcement.category}</span>
      </div>
      <div className='flex flex-col mt-6 mx-2'>
        <h1 className='text-lg text-gray-500 mb-2'>Announcement</h1>
        <div className='max-w-6xl mx-auto w-full announcement-content' dangerouslySetInnerHTML={{__html: announcement && announcement.content}}></div>
        <img src={announcement && announcement.image} alt={announcement && announcement.title} className='mt-5 p-3 mb-10 max-w-[400px] max-h-[200px] mx-auto border-4 'style={{ borderRadius: '0.5rem' }}/>
      </div>
        <hr className=" border-zinc-950 dark:border-orange-400" />
          <h1 className='text-xl p-2 uppercase text-cyan-500 font-serif mx-auto'>Recent Announcement</h1>
          <hr className=" border-zinc-950 dark:border-orange-400" />
        
            {/* Render Recent Announcements */}
            <div className='flex flex-wrap gap-5 mt-5 mb-10 justify-center '>
              {recentAnnouncements && recentAnnouncements.map((announcement) => <AnnouncementCard key={announcement._id} announcement={announcement} />)}
            </div>
          
    </main>
)}