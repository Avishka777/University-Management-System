import { Link } from 'react-router-dom';

export default function AnnouncementCard({ announcement }) {

  // Function to truncate content if it exceeds 100 characters
  const truncateContent = (content) => {
    if (content.length > 180) {
      return content.substring(0, 180) + '...';
    }
    return content;
  };

  return (
    <div className='border border-teal-500 hover:border-2 overflow-hidden rounded-lg transition-all h-[100px] w-full flex flex-row'>
      <div className='min-w-[200px]'>
        <Link to={`/announcement/${announcement.slug}`}>
          <img
            src={announcement.image}
            alt='announcement cover'
            className='h-[100px] w-[200px]'
          />
        </Link>
      </div>
        <div className='gap-2 ml-3 mr-3 mt-1'>
        <Link to={`/announcement/${announcement.slug}`}>
          <div>
            <span className='text-lg font-semibold'>{announcement.title}</span>
            <hr className="mt-1 mb-1 border-gray-500" />
            <span dangerouslySetInnerHTML={{__html: announcement &&  truncateContent(announcement.content)}}></span>
          </div>
        </Link>        
      </div>
    </div>

  );
}