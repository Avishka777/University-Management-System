import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthAnnouncements, setLastMonthAnnouncements] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
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
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcement/getannouncements?limit=5');
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
    }
  }, [currentUser]);
  return (
    <div className='p-3 md:mx-auto '>
      <div className='flex flex-row gap-4 justify-center '>
        
        <div className='flex flex-col p-2 dark:bg-slate-800 gap-4 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className='flex flex-row'>
              <HiOutlineUserGroup className='bg-red-800  text-white rounded-full text-5xl p-3 shadow-lg m-2 ' />
              <h3 className='text-gray-400 text-2xl m-4'>Total Users</h3>
              <p className='text-2xl m-4'>{totalUsers}</p>
            </div>
            <div className='flex gap-2 text-sm m-auto mr-2'>
              {currentUser.isAdmin && (
                <Link to={'/sign-up'}>
                  <Button
                    type='button'
                    gradientDuoTone='purpleToPink'
                    className='w-full'
                  >
                    Create User
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className='flex  gap-2 text-sm ml-3'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex flex-col p-2 dark:bg-slate-800 gap-4 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className='flex flex-row'>
            <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg m-2 ' />
              <h3 className='text-gray-400 text-2xl m-4'>Total Announcements</h3>
              <p className='text-2xl m-4'>{totalAnnouncements}</p>
            </div>
            <div className='flex gap-2 text-sm m-auto mr-2'>
              {currentUser.isAdmin && (
                <Link to={'/create-announcement'}>
                  <Button
                    type='button'
                    gradientDuoTone='purpleToPink'
                    className='w-full'
                  >
                    Create Notice
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className='flex  gap-2 text-sm ml-3'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthAnnouncements}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent users</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
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
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent Announcements</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=announcements'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Announcement image</Table.HeadCell>
              <Table.HeadCell>Announcement Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {announcements &&
              announcements.map((announcement) => (
                <Table.Body key={announcement._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img
                        src={announcement.image}
                        alt='user'
                        className='w-14 h-10 rounded-md bg-gray-500'
                      />
                    </Table.Cell>
                    <Table.Cell className='w-96'>{announcement.title}</Table.Cell>
                    <Table.Cell className='w-5'>{announcement.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}