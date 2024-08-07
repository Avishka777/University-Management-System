import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { set } from 'mongoose';

export default function DashAnnouncements() {
  const { currentUser } = useSelector((state) => state.user); // Getting Current User From Redux Store
  const [userAnnouncements, setUserAnnouncements] = useState([]); // State Variable For Storing User Announcements
  const [showMore, setShowMore] = useState(true); // State Variable For Showing More Announcements
  const [showModal, setShowModal] = useState(false); // State Variable For Showing Modal
  const [announcementIdToDelete, setAnnouncementIdToDelete] = useState(''); // State Variable For Storing Announcement ID To Delete

  //Function Get Announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`/api/announcement/getannouncements?=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserAnnouncements(data.announcements);
          if (data.announcements.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchAnnouncements();
    }
  }, [currentUser._id]);

  //Function Get More Announcements
  const handleShowMore = async () => {
    const startIndex = userAnnouncements.length;
    try {
      const res = await fetch(
        `/api/announcement/getannouncements?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserAnnouncements((prev) => [...prev, ...data.announcements]);
        if (data.announcements.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Function Delete Announcements
  const handleDeleteAnnouncement = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/announcement/deleteannouncement/${announcementIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserAnnouncements((prev) =>
          prev.filter((announcement) => announcement._id !== announcementIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='w-full p-5'>
      {currentUser.isAdmin && userAnnouncements.length > 0 ? (
        <>
         {/* Table Of Announcements */}
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Announcement Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userAnnouncements.map((announcement) => (
              <Table.Body className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(announcement.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/announcement/${announcement.slug}`}>
                      <img
                        src={announcement.image}
                        alt={announcement.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/announcement/${announcement.slug}`}
                    >
                      {announcement.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{announcement.category}</Table.Cell>
                  <Table.Cell>
                    {/* Delete Link */}
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setAnnouncementIdToDelete(announcement._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {/* Edit Link */}
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-announcement/${announcement._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              {/* Show More Button */}
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You Have No Announcements Yet!</p>
      )}
      {/* Modal for confirmation */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this Announcement?
            </h3>
            <div className='flex justify-center gap-4'>
              {/* Delete Confirmation Button */}
              <Button color='failure' onClick={handleDeleteAnnouncement}>
                Yes, I'm sure
              </Button>
              {/* Cancel Button */}
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}