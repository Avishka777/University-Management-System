import React, { useEffect, useState } from 'react';
import { Modal, Table, Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashClassroom() {
  const { currentUser } = useSelector((state) => state.user);
  const [userClassrooms, setUserClassrooms] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [classroomIdToDelete, setClassroomIdToDelete] = useState('');

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await fetch(`/api/classroom/getclassrooms?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserClassrooms(data);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchClassrooms();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userClassrooms.length;
    try {
      const res = await fetch(`/api/classroom/getclassrooms?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserClassrooms((prev) => [...prev, ...data]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteClassroom = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/classroom/deleteclassroom/${classroomIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserClassrooms((prev) => prev.filter((classroom) => classroom._id !== classroomIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='w-full p-5 scrollbar'>
      {currentUser.isAdmin && userClassrooms.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Room Name</Table.HeadCell>
              <Table.HeadCell>Capacity</Table.HeadCell>
              <Table.HeadCell>Facilities</Table.HeadCell>
              <Table.HeadCell>Booked Dates</Table.HeadCell>
              <Table.HeadCell>Start Time</Table.HeadCell>
              <Table.HeadCell>End Time</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userClassrooms.map((classroom) => (
              <Table.Body key={classroom._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{classroom.roomName}</Table.Cell>
                  <Table.Cell>{classroom.capacity}</Table.Cell>
                  <Table.Cell>{classroom.facilities}</Table.Cell>
                  <Table.Cell>{classroom.bookings.map((booking, index) => (
                      <div key={index}>
                        <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell>{classroom.bookings.map((booking, index) => (
                      <div key={index}>
                        <p>Start Time: {booking.startTime}</p> 
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell>{classroom.bookings.map((booking, index) => (
                    <div key={index}>
                      <p>End Time: {booking.endTime}</p>
                    </div>
                  ))}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setClassroomIdToDelete(classroom._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/update-classroom/${classroom._id}`}>
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You Have No Class Room Yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this Class Room?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteClassroom}>
                Yes, I'm sure
              </Button>
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
