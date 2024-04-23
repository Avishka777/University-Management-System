import React, { useEffect, useState } from 'react';
import { Alert, Button, Label, Select, TextInput } from 'flowbite-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateTimetable() {
  // State Variables
  const [formData, setFormData] = useState({
    classSession: '',
    course: 'No',
    day: '',
    startTime: '',
    endTime: '',
    faculty: 'No',
    location: ''
  });
  const [publishError, setPublishError] = useState(null); // Publish Error State
  const { timetableId } = useParams(); // Get Timetable ID From URL Params
  const navigate = useNavigate(); // Navigation Hook
  const { currentUser } = useSelector((state) => state.user); // Redux Hook to Get Current User

  // Fetch Timetable Data When TimetableId Changes  
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch(`/api/timetable/gettimetable/${timetableId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setPublishError(null);
        setFormData(data);
      } catch (error) {
        setPublishError('Something went wrong');
      }
    };

    fetchTimetable();
  }, [timetableId]);

  // Function to Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/timetable/updatetimetable/${timetableId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      navigate(`/dashboard?tab=timetables`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

// Function to handle input change for the date field
const handleInputChange = (e) => {
    if (e.target.type === 'date') {
      const selectedDate = new Date(e.target.value);
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Extract "yyyy-MM-dd" portion
      setFormData({ ...formData, [e.target.name]: formattedDate });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  
  

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen mt-10'>
      <div>
        <h1 className="text-3xl text-red-600 text-center font-serif uppercase "> - Update Time Table - </h1>
        <hr className="my-4 border-gray-300 dark:border-gray-600" />
      </div>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/* Timetable Name Input */}
        <div className='mt-2'>
          <Label value='Class Session' />
          <TextInput
            type='text'
            placeholder='Class Session'
            required
            id='classSession'
            className='flex-1 mt-2'
            name='classSession'
            value={formData.classSession}
            onChange={handleInputChange}
          />
        </div>
        {/* Course Input */}
        <div className='mt-2'>
          <Label value='Course' />
          <Select
            className='mt-2'
            name='course'
            value={formData.course}
            onChange={handleInputChange}
          >
            <option value='No'>Select Course</option>
            <option value='65f7d51ef9c25879110c97cd'>Software Architecture</option>
            <option value='65f7d5b4f9c25879110c97d2'>Distributed Systems</option>
            <option value='65f7d9d85e15b4a1f6eb9c17'>Software Engineering Process & Quality Management</option>
            <option value='65f81e21f98bef1c39cde5a7'>Application Frameworks</option>
            <option value='65f87c8f5453d75e62bfa2c4'>Operating Systems and System Administration</option>
            <option value='65f87cbe5453d75e62bfa2cf'>Computer Networks</option>
            <option value='65f87cde5453d75e62bfa2da'>Database Management Systems</option>
            <option value='65f87d025453d75e62bfa2e5'>Object Oriented Programming</option>
            <option value='65f87d2f5453d75e62bfa2f0'>Software Engineering</option>
          </Select>
        </div>
        <div className='flex flex-row mx-auto justify-between w-full'>
            <div className='mt-2 w-4/12 mr-4'>
            <Label value='Date' />
            <TextInput
                type='date'
                placeholder='Date'
                required
                id='day'
                className='flex-1 mt-2'
                name='day'
                value={formData.day || ''}
                onChange={handleInputChange}
            />
            </div>
            <div className='mt-2 w-4/12 mr-4'>
            <Label value='Start Time' />
            <TextInput
                type='time'
                placeholder='Start Time'
                required
                id='startTime'
                className='flex-1 mt-2'
                name='startTime'
                value={formData.startTime}
                onChange={handleInputChange}
            />
            </div>
            <div className='mt-2 w-4/12 '>
            <Label value='End Time' />
            <TextInput
                type='time'
                placeholder='End Time'
                required
                id='endTime'
                className='flex-1 mt-2'
                name='endTime'
                value={formData.endTime}
                onChange={handleInputChange}
            />
            </div>
        </div>
         {/* Lecture Input */}
         <div className='mt-2'>
          <Label value='Assigned Lecture' />
          <Select
            className='mt-2'
            name='faculty'
            value={formData.faculty}
            onChange={handleInputChange}
          >
            <option value='No'>Select Lecturer</option>
            <option value='65faafe26a08c9c2d231e3d6'>Mr. Pasan Fernando</option>
            <option value='65faaffa6a08c9c2d231e3d8'>Mr. Dananjaya Abesinghe</option>
            <option value='65fa98425e8a62d5e954e25f'>Mr. Avishka Rathnakumara</option>
            <option value='65fab0136a08c9c2d231e3da'>Mrs. Sudarika Chethani</option>
            <option value='65fab02a6a08c9c2d231e3dc'>Mrs. Dimesha Wijerathne</option>
          </Select>
        </div>
        {/* Location Input */}
        <div className='mt-2'>
          <Label value='Location' />
          <TextInput
            type='text'
            placeholder='Location'
            required
            id='location'
            className='flex-1 mt-2'
            name='location'
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
        {/* Button To Submit Form */}
        <Button type='submit' gradientDuoTone='purpleToPink' className='mt-2'>
          Update Time Table
        </Button>
        {/* Display Publish Error If Present */}
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
