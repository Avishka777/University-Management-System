import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnnouncementCard from '../components/AnnouncementCard';

export default function Search() {
  // State For Storing Search Filters
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  // State For Storing Announcement Data
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  // Get Current URL Location
  const location = useLocation();
  // Initialize Navigation Hook
  const navigate = useNavigate();

  // Effect Hook To Update Data Based On URL Changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    // Function To Fetch Announcements Bbased On URL Parameters
    const fetchAnnouncements = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/announcement/getannouncements?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements);
        setLoading(false);
        if (data.announcements.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchAnnouncements();
  }, [location.search]);

  // Handler For Input Changes
  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({ ...sidebarData, category });
    }
  };

  // Handler For Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // Handler For Showing More Announcements
  const handleShowMore = async () => {
    const numberOfAnnouncements = announcements.length;
    const startIndex = numberOfAnnouncements;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/announcement/getannouncements?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setAnnouncements([...announcements, ...data.announcements]);
      if (data.announcements.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      {/* Sidebar With Search Filters */}
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500 min-w-[300px]'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          {/* Search Term Input */}
          <div className='items-center gap-2'>
            <label className='whitespace-nowrap font-semibold ml-1'>
              Search Term:
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className='mt-3'
            />
          </div>
          {/* Sort Select */}
          <div className='items-center gap-2'>
            <label className='font-semibold ml-1'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort' className='mt-3'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          {/* Category Select */}
          <div className='items-center gap-2'>
            <label className='font-semibold ml-1'>Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
              className='mt-3'
            >
                <option value='uncategorized'>Select a Faculty</option>
                <option value='All Students'>All Students</option>
                <option value='Faculty of Computing'>Faculty of Computing</option>
                <option value='Faculty of Engineering'>Faculty of Engineering</option>
                <option value='Faculty of Business'>Faculty of Business</option>
            </Select>
          </div>
          {/* Apply Filters Button */}
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>
      {/* Announcement Results */}
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Announcements Results :
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {/* Show Loading or No Results Message */}
          {!loading && announcements.length === 0 && (
            <p className='text-xl text-gray-500'>No Announcements Found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {/* Display Announcements */}
          {!loading &&
            announcements &&
            announcements.map((announcement) => <AnnouncementCard key={announcement._id} announcement={announcement} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}