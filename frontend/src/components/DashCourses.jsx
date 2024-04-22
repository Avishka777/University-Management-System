import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { set } from 'mongoose';

export default function DashCourses() {

  const { currentUser } = useSelector((state) => state.user); // Getting Current User From Redux Store
  const [userCourses, setUserCourses] = useState([]); // State Variable For Storing User Courses
  const [showMore, setShowMore] = useState(true); // State Variable For Showing More Courses
  const [showModal, setShowModal] = useState(false); // State Variable For Showing Modal
  const [courseIdToDelete, setCourseIdToDelete] = useState(''); // State Variable For Storing Course ID To Delete

  //Function Get Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`/api/course/getcourses?=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserCourses(data.courses);
          if (data.courses.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchCourses();
    }
  }, [currentUser._id]);

  //Function Get More Courses
  const handleShowMore = async () => {
    const startIndex = userCourses.length;
    try {
      const res = await fetch(
        `/api/course/getcourses?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserCourses((prev) => [...prev, ...data.courses]);
        if (data.courses.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Function Delete Courses
  const handleDeleteCourse = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/course/deletecourse/${courseIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserCourses((prev) =>
          prev.filter((course) => course._id !== courseIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='w-full p-5 scrollbar'>
      {currentUser.isAdmin && userCourses.length > 0 ? (
        <>
         {/* Table Of Courses */}
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Added</Table.HeadCell>
              <Table.HeadCell>Course ID</Table.HeadCell>
              <Table.HeadCell>Course Name</Table.HeadCell>
              <Table.HeadCell>Credit</Table.HeadCell>
              <Table.HeadCell>Lecturer</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userCourses.map((course) => (
              <Table.Body className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                  <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/course/${course.slug}`}
                    >
                      {course.courseCode}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/course/${course.slug}`}
                    >
                      {course.courseName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{course.courseCredit}</Table.Cell>
                  <Table.Cell>{course.enrolledfaculty}</Table.Cell>
                  <Table.Cell>
                    {/* Delete Link */}
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCourseIdToDelete(course._id);
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
                      to={`/update-course/${course._id}`}
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
        <p>You Have No Courses Yet!</p>
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
              Are you sure you want to delete this Course?
            </h3>
            <div className='flex justify-center gap-4'>
              {/* Delete Confirmation Button */}
              <Button color='failure' onClick={handleDeleteCourse}>
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