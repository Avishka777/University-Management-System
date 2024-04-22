import { Footer } from 'flowbite-react';
import { BsFacebook, BsInstagram, BsTwitter, BsDribbble } from 'react-icons/bs';
import logo from '../assets/logo.png';

export default function FooterCom() {
  return (
    // Footer Container
    <Footer container className='border border-t-7 shadow-lg rounded-none'>
      <div className='w-full ml-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          {/* Logo And University Name */}
          <div className='mt-5 ml-40'>  
            <img src={logo} className="ml-auto mr-auto" alt="SLIIT Logo" width="140" height="40" />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">STARK UNIVERSITY</span>
          </div>
          
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='Reference' />
              {/* Links For Reference */}
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Faculty of Computing</Footer.Link>
                <Footer.Link href='#'>Faculty of Engineering</Footer.Link>
                <Footer.Link href='#'>Faculty of Business</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Services' />
              {/* Links For Services */}
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Help Desk</Footer.Link>
                <Footer.Link href='#'>Student Service</Footer.Link>
                <Footer.Link href='#'>Vehicle Service</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              {/* Links For Legal Information */}
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>

        </div>
          
        {/* Divider line */}
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between ml-40'>
          {/* Copyright notice */}
          <Footer.Copyright
            by="Copyright Avishka Rathnakumara. All Rights Reserved."
            year={new Date().getFullYear()}
          />
          {/* Icons aligned to the right */}
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-end">
            <Footer.Icon href="#" icon={BsFacebook} className="mr-6"/>
            <Footer.Icon href="#" icon={BsInstagram} className="mr-6"/>
            <Footer.Icon href="#" icon={BsTwitter} className="mr-6"/>
            <Footer.Icon href="#" icon={BsDribbble} className="mr-56"/>
          </div>
        </div>
      </div>
    </Footer>
  );
}
