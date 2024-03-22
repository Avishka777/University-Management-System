import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import logo from '../assets/logo.png';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className='border-b-2'>
      <Navbar.Brand href="#">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="SLIIT Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SLIIT UNIVERSITY</span>
      </Navbar.Brand>

      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      
      <div className='flex gap-2 md:order-2'>
      <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt='user' img={currentUser.profilePicture} rounded />
          }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'} style={{ color: path === "/" ? "#F05941" : "#387ADF" }}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        
        <div className="border-l border-gray-500 h-6"></div>
        
        <Navbar.Link active={path === '/programmes'} as={'div'} style={{ color: path === "/programmes" ? "#F05941" : "#387ADF" }}>
          <Link to='/programmes'>Programmes</Link>
        </Navbar.Link>
        <div className="border-l border-gray-500 h-6"></div>
        
        <Navbar.Link active={path === '/time-table'} as={'div'} style={{ color: path === "/time-table" ? "#F05941" : "#387ADF" }}>
          <Link to='/time-table'>Time Table</Link>
        </Navbar.Link>
        <div className="border-l border-gray-500 h-6"></div>
        
        <Navbar.Link active={path === '/about'} as={'div'} style={{ color: path === "/about" ? "#F05941" : "#387ADF" }}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
      
      </Navbar.Collapse>
    </Navbar>
  );
}