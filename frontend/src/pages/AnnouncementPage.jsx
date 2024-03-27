import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnnouncementCard from '../components/AnnouncementCard';

export default function AnnouncementPage() {
  const { announcementSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [recentAnnouncements, setRecentAnnouncements] = useState(null);

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

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return <main className='flex flex-col mx-auto min-h-screen'>

          <div className="flex justify-center p-3 border-b border-slate-700 mx-auto w-full max-w-5xl text-xs">
            <h1 className='text-xl mt-10 text-center mx-auto lg:text-2xl uppercase'>{announcement && announcement.title}</h1>
          </div>

          <h3 className='text-xl mt-2 text-center font-serif max-w-xl mx-auto uppercase text-gray-400'>{announcement && announcement.category}</h3>

          <div className="flex justify-center p-3 mx-auto w-full max-w-6xl text-xs text-gray-400">
              <span>{announcement && new Date(announcement.createdAt).toLocaleDateString()}</span>
          </div>
          <div className='p-3 max-w-4xl mx-auto w-full announcement-content' dangerouslySetInnerHTML={{__html: announcement && announcement.content}}></div>
          <img src={announcement && announcement.image} alt={announcement && announcement.title} className='mt-5 p-3 max-w-[400px] max-h-[200px] mx-auto border-4 'style={{ borderRadius: '0.5rem' }}/>


          <div className='flex flex-col justify-center items-center mb-5 mx-auto max-w-6xl'>
            <div className="flex justify-center p-3 border-b border-slate-500 mx-auto w-full max-w-5xl mt-3 text-xs"></div>
              <h1 className='text-3xl mt-5 mb-5 uppercase'>Recent Announcement</h1>

              <div className='flex flex-wrap gap-5 mt-5 mb-10 justify-center'>
                {recentAnnouncements &&
                  recentAnnouncements.map((announcement) => <AnnouncementCard key={announcement._id} announcement={announcement} />)}
              </div>
            </div>

  </main>;
}