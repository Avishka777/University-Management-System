import { Link } from 'react-router-dom';

export default function AnnouncementCard({ announcement }) {
  
  // Function To Truncate Content If It Exceeds 180 Characters
  const truncateContent = (content) => {
    if (content.length > 180) {
      return content.substring(0, 180) + '...';
    }
    return content;
  };

  // Function To Truncate Title If It Exceeds 100 Characters
  const truncateTitle = (title) => {
    if (title.length > 98) {
      return title.substring(0, 100) + '...';
    }
    return title;
  };

  // Render The Announcement Card
  return (
    <div className='border border-teal-500 hover:border-2 overflow-hidden rounded-lg transition-all h-[100px] w-full flex flex-row'>
       {/* Announcement Image */}
      <div className='min-w-[200px]'>
        <Link to={`/announcement/${announcement.slug}`}>
          <img
            src={announcement.image}
            alt='announcement cover'
            className='h-[100px] w-[200px]'
          />
        </Link>
      </div>
      {/* Announcement Details */}
        <div className='gap-2 ml-3 mr-3 mt-1'>
        <Link to={`/announcement/${announcement.slug}`}>
          <div>
            {/* Title */}
            <span className='text-lg font-semibold'>{truncateTitle(announcement.title)}</span>
            <hr className="mt-1 mb-1 border-gray-500" />
            {/* Content */}
            <span dangerouslySetInnerHTML={{__html: announcement &&  truncateContent(announcement.content)}}></span>
          </div>
        </Link>        
      </div>
    </div>

  );
}
