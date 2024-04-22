import { Sidebar } from 'flowbite-react';
import { HiUser, HiLogout, HiCalendar, HiOutlineUserGroup, HiChartBar,HiChatAlt2,HiOutlineAcademicCap,HiBell,HiOfficeBuilding } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  // Update Active Tab Based On URL Change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Function To Handle User Signout
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {/* Profile Link */}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>Profile</Sidebar.Item>
          </Link>

          {/* Dashboard Link */}
          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartBar} as='div'>Dashboard</Sidebar.Item>
            </Link>
          )}

          {/* Users Link */}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>Users</Sidebar.Item>
            </Link>
          )}
          {/* Announcements Link */}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=announcements'>
              <Sidebar.Item active={tab === 'announcements'} icon={HiChatAlt2} as='div'>Announcements</Sidebar.Item>
            </Link>
          )}

          {/* Courses Link */}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=courses'>
              <Sidebar.Item active={tab === 'courses'} icon={HiOutlineAcademicCap} as='div'>Courses</Sidebar.Item>
            </Link>
          )}

          {/* Time Table Link */}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=timetables'>
              <Sidebar.Item active={tab === 'timetables'} icon={HiCalendar} as='div'>Time Tables</Sidebar.Item>
            </Link>
          )}

          {/* Class Room Link */}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=classrooms'>
              <Sidebar.Item active={tab === 'classrooms'} icon={HiOfficeBuilding} as='div'>Room Booking</Sidebar.Item>
            </Link>
          )}

          {/* Notificaion Link */}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=notifications'>
              <Sidebar.Item active={tab === 'notifications'} icon={HiBell} as='div'>Notification</Sidebar.Item>
            </Link>
          )}

          {/* Sign Out Button */}
          <Sidebar.Item
            icon={HiLogout}
            className='cursor-pointer'
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}