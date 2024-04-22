import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiBookOpen,
  HiArrowNarrowUp,
  HiChatAlt2,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]); // State Variable For Storing Users Data
  const [announcements, setAnnouncements] = useState([]); // State Variable For Storing Announcements Data
  const [totalUsers, setTotalUsers] = useState(0); // State Variable For storing Total Number Of Users
  const [totalAnnouncements, setTotalAnnouncements] = useState(0); // State Variable For Storing Total Number Of Announcements
  const [lastMonthUsers, setLastMonthUsers] = useState(0); // State Variable For Storing Number Of Users From Last Month
  const [lastMonthAnnouncements, setLastMonthAnnouncements] = useState(0); // State Variable For Storing Number Of Announcements From Last Month
  const { currentUser } = useSelector((state) => state.user); // Getting Current User From Redux Store

  const [lastMonthCourses, setLastMonthCourses] = useState(0); // State Variable For Storing Number Of Courses From Last Month
  const [totalCourses, setTotalCourses] = useState(0); // State Variable For Storing Total Number Of Courses
  const [courses, setCourses] = useState([]); // State Variable For Storing Courses Data

  useEffect(() => {
    // Function To Fetch Users Data
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    // Function To Fetch Announcements Data
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcement/getannouncements?limit=6');
        const data = await res.json();
        if (res.ok) {
          setAnnouncements(data.announcements);
          setTotalAnnouncements(data.totalAnnouncements);
          setLastMonthAnnouncements(data.lastMonthAnnouncements);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchAnnouncements();
      fetchCourses();
    }
  }, [currentUser]);

  // Function To Fetch Courses Data
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/course/getcourses?limit=8');
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses);
        setTotalCourses(data.totalCourses);
        setLastMonthCourses(data.lastMonthCourses);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-5 w-full'>
      {/* Buttons To Createions */}
      <div className='flex gap-2 text-sm m-auto mb-3'>
          {currentUser.isAdmin && (
            <Link to={'/sign-up'}>
              <Button type='button' gradientDuoTone='purpleToBlue' className='w-full'>Create User</Button>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={'/create-announcement'}>
              <Button type='button' gradientDuoTone='cyanToBlue' className='w-full'>Create Announcement</Button>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={'/create-course'}>
              <Button type='button' gradientDuoTone='greenToBlue' className='w-full'>Create Course</Button>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={'/create-timetable'}>
              <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>Create Time Table</Button>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={'/create-classroom'}>
              <Button type='button' gradientDuoTone='pinkToOrange' className='w-full'>Create Room Booking</Button>
            </Link>
          )}
        </div>
      
      {/* Displaying Total Users And Recent Users and Courses */}
      <div className='flex flex-row gap-5 justify-center w-full mt-3 '>
        
        {/* Total Users Component */}
        <div className='flex flex-col p-2 dark:bg-slate-800 gap-4 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className='flex flex-row'>
              <HiOutlineUserGroup className='bg-blue-500  text-white rounded-full text-5xl p-3 shadow-lg m-2 ' />
              <h3 className='text-gray-400 text-xl m-4 uppercase'>Total Users</h3>
              <p className='text-xl m-4'>{totalUsers}</p>
            </div>
          </div>
          {/* Displaying Last Month Users Count */}
          <div className='flex  gap-2 text-sm ml-3'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

        {/* Total Announcements Component */} 
        <div className='flex flex-col p-2 dark:bg-slate-800 gap-4 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className='flex flex-row'>
            <HiChatAlt2 className='bg-cyan-600  text-white rounded-full text-5xl p-3 shadow-lg m-2 ' />
              <h3 className='text-gray-400 text-xl m-4 uppercase'>Total Announcements</h3>
              <p className='text-xl m-4'>{totalAnnouncements}</p>
            </div>
          </div>
          {/* Displaying Last Month Announcements Count */}
          <div className='flex  gap-2 text-sm ml-3'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthAnnouncements}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

        {/* Total Courses Component */} 
        <div className='flex flex-col p-2 dark:bg-slate-800 gap-4 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className='flex flex-row'>
            <HiOutlineAcademicCap className='bg-green-400  text-white rounded-full text-5xl p-3 shadow-lg m-2 ' />
              <h3 className='text-gray-400 text-xl m-4 uppercase'>Total Courses</h3>
              <p className='text-xl m-4'>{totalCourses}</p>
            </div>
          </div>
          {/* Displaying Last Month Courses Count */}
          <div className='flex  gap-2 text-sm ml-3'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthCourses}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>       
         
      </div>

      {/* Displaying Recent Users And Recent Announcements */}
      <div className='flex flex-row gap-4 py-3  min-w-full'>
        
        {/* Recent Users Component */}
        <div className='flex flex-col w-3/12 shadow-md rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent users</h1>
            <Button outline gradientDuoTone='purpleToBlue'>
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>User name</Table.HeadCell>
            </Table.Head>
            {/* Displaying List Of Recent Users */}
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt='user'
                        className='w-10 h-10 rounded-full bg-gray-500'
                      />
                    </Table.Cell>
                    <Table.Cell className='w-13 text-xs' >{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* Recent Announcements Component */}
        <div className='flex flex-col w-6/12  shadow-md rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent Announcements</h1>
            <Button outline gradientDuoTone='cyanToBlue'>
              <Link to={'/dashboard?tab=announcements'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Announcement Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {/* Displaying List Of Recent Announcements */}
            {announcements &&
              announcements.map((announcement) => (
                <Table.Body key={announcement._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell className='w-96 text-xs'>{announcement.title}</Table.Cell>
                    <Table.Cell className='w-5 text-xs'>{announcement.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* Recent Courses Component */}
        <div className='flex flex-col w-3/12 shadow-md rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent Courses</h1>
            <Button outline gradientDuoTone='greenToBlue'>
              <Link to={'/dashboard?tab=courses'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Course Name</Table.HeadCell>
            </Table.Head>
            {/* Displaying List Of Recent Courses */}
            {courses &&
              courses.map((course) => (
                <Table.Body key={course._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell className='w-15 text-xs'>{course.courseName}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

      </div>
    </div>

  );
}