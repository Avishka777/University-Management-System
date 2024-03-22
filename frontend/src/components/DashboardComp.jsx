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
  const [notifications, setNotifications] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthNotifications, setLastMonthNotifications] = useState(0);
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
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notification/getnotifications?limit=5');
        const data = await res.json();
        if (res.ok) {
          setNotifications(data.notifications);
          setTotalNotifications(data.totalNotifications);
          setLastMonthNotifications(data.lastMonthNotifications);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchNotifications();
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
              <h3 className='text-gray-400 text-2xl m-4'>Total Notifications</h3>
              <p className='text-2xl m-4'>{totalNotifications}</p>
            </div>
            <div className='flex gap-2 text-sm m-auto mr-2'>
              {currentUser.isAdmin && (
                <Link to={'/create-notification'}>
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
              {lastMonthNotifications}
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
            <h1 className='text-center p-2'>Recent Notifications</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=notifications'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Notification image</Table.HeadCell>
              <Table.HeadCell>Notification Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {notifications &&
              notifications.map((notification) => (
                <Table.Body key={notification._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img
                        src={notification.image}
                        alt='user'
                        className='w-14 h-10 rounded-md bg-gray-500'
                      />
                    </Table.Cell>
                    <Table.Cell className='w-96'>{notification.title}</Table.Cell>
                    <Table.Cell className='w-5'>{notification.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}