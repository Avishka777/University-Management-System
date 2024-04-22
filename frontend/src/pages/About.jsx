import React from 'react'
import logo from '../assets/logo.png';
import vision from '../assets/vision.png';
import mission from '../assets/mission.jpg';
import obj from '../assets/objective.jpg';

export default function About() {
  return (
    
    <div className='flex flex-col gap-2 mt-10 mb-10 px-3 max-w-6xl mx-auto '>
      <div className='flex felx-row'>
          <img src={logo} className="h-50 w-60 rounded-lg mr-10" alt="Stark Logo" />
          <h1 className='uppercase my-auto mr-auto text-cyan-500 text-5xl  font-serif'>About Us...</h1>
      </div>
      <hr className="border-gray-300 dark:border-orange-400 mt-8" />
      <h1 className='text-2xl text-cyan-500'>STARK UNIVERSITY</h1>
      <hr className="border-gray-300 dark:border-orange-400 mb-3" />
      <p className='text-stone-500'>The STARK UNIVERSITY was founded in 1999 and is a University Grants Commission (UGC) recognized Institute that stands today as a symbol of excellence in private tertiary education. 
        Celebrating 23 years, STARK UNIVERSITY is a member of the Association of Commonwealth Universities (ACU) and the International Association of Universities (IAU) and is also the 
        first Sri Lankan Institute to be accredited by the Institution of Engineering and Technology, UK.</p>
      <p className='text-stone-500 mb-10'>STARK UNIVERSITY has officially placed in the Top 750 of the Asian higher education institutions in the QS Asia University rankings 2023 and is one of the few Sri Lankan 
        universities included. The Institute produces highly employable graduates at all levels in IT and other industries and accommodate over 25,000+ students and 30,000+ alumni with 
        a 96% employment rate.</p>

      <div className='flex gap-6 justify-between mb-8'>
        <div class="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <img src={mission} className="h-50 w-70 rounded-lg m-auto" alt="Stark Logo" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">Our Mission...</h5>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">To foster academic excellence, inspire innovation, and cultivate lifelong learning within a diverse and inclusive community.</p>
                <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>
            </div>
        </div>

        <div class="max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <img src={obj} className="max-h-50 w-full rounded-lg m-auto" alt="Stark Logo" />
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">Our Objectives...</h5>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">To provide quality education, promote research and scholarship, and empower students to thrive in a global society.</p>
                <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>
            </div>
        </div>
      </div>

      <div class="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mb-10">
          <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Learn Fast From Anywhere</h5>
          <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">Stay up to date and move work forward with Flowbite on iOS & Android. Download the learning app today.</p>
          <div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
              <a href="#" class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                  <svg class="me-3 w-7 h-7" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>
                  <div class="text-left rtl:text-right">
                      <div class="mb-1 text-xs">Download on the</div>
                      <div class="-mt-1 font-sans text-sm font-semibold">Mac App Store</div>
                  </div>
              </a>
              <a href="#" class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                  <svg class="me-3 w-7 h-7" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google-play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"></path></svg>
                  <div class="text-left rtl:text-right">
                      <div class="mb-1 text-xs">Get in on</div>
                      <div class="-mt-1 font-sans text-sm font-semibold">Google Play</div>
                  </div>
              </a>
          </div>
      </div>


    </div>
  )
}
