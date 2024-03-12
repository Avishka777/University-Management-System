// Import necessary components and assets
import { Button, Navbar } from 'flowbite-react';
import logo from '../assets/logo.png';
import { FaMoon } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

// Header component definition
export default function Header() {
  // Get the current path using useLocation hook
  const path = useLocation().pathname;

  return (
    // Navbar container with shadow
    <Navbar fluid rounded className='shadow'>

      {/* Brand section with SLIIT logo and name */}
      <Navbar.Brand href="#" className='ml-40'>
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="SLIIT Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SLIIT UNIVERSITY</span>
      </Navbar.Brand>

      {/* Navigation links with active styles based on the current path */}
      <Navbar.Collapse >
        {/* Home link */}
        <Navbar.Link active={path === "/"} as={'div'} style={{ color: path === "/" ? "#F05941" : "#387ADF" }}>
          <Link to='/' className="text-base sm:text-xl">Home</Link>
        </Navbar.Link>

        {/* Divider line */}
        <div className="border-l border-gray-500 h-8"></div>

        {/* Programmes link */}
        <Navbar.Link active={path === "/programmes"} as={'div'} style={{ color: path === "/programmes" ? "#F05941" : "#387ADF" }}>
          <Link to='/programmes' className="text-base sm:text-lg">Programmes</Link>
        </Navbar.Link>

        {/* Divider line */}
        <div className="border-l border-gray-500 h-8"></div>

        {/* Time Table link */}
        <Navbar.Link active={path === "/time-table"} as={'div'} style={{ color: path === "/time-table" ? "#F05941" : "#387ADF" }}>
          <Link to='/time-table' className="text-base sm:text-lg">Time Table</Link>
        </Navbar.Link>

        {/* Divider line */}
        <div className="border-l border-gray-500 h-8"></div>

        {/* About link */}
        <Navbar.Link active={path === "/about"} as={'div'} style={{ color: path === "/about" ? "#F05941" : "#387ADF" }}>
          <Link to='/about' className="text-base sm:text-lg" >About</Link>
        </Navbar.Link>
      </Navbar.Collapse>

      {/* Buttons section for Sign In, Sign Up, and Theme Change */}
      <div className='flex gap-4 mr-5'>
        {/* Sign In button */}
        <Link to='/sign-in' className="flex-none"> 
          <Button gradientDuoTone="purpleToBlue" outline> 
            Sign In
          </Button>
        </Link>
        {/* Sign Up button */}
        <Link to='/sign-up' className="flex-none"> 
          <Button gradientDuoTone="pinkToOrange" outline> 
            Sign Up
          </Button>
        </Link>
        {/* Theme Change button */}
        <Button className='hidden sm:inline' color='gray'> 
          <FaMoon/>
        </Button>
      </div>
    </Navbar>
  );
}