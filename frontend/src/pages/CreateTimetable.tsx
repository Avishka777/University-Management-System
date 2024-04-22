import { Alert, Button, FileInput, Label, Select, TextInput } from 'flowbite-react';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function CreateTimetable() {

 // State Variables To 
 const [formData, setFormData] = useState({});
 const [publishError, setPublishError] = useState<string | null>(null);

 // Hook For Navigation
 const navigate = useNavigate();

 // Function To Handle Form Submission
 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const res = await fetch('/api/timetable/create', {
       method: 'POST',
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

     if (res.ok) {
       setPublishError(null);
       navigate(`/dashboard?tab=timetables`);
     }
   } catch (error) {
    setPublishError('Something Went Wrong');
   }
 };

  return (
    
    <div className='p-3 max-w-3xl mx-auto min-h-screen mt-10'>
      <div>
          <h1 className="text-3xl text-red-600 text-center font-serif uppercase shadow-lg"> - Create Time Table - </h1>
          <hr className="my-4 border-gray-300 dark:border-gray-600" />
      </div>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/* Input Fields For Class Session */}
          <div className='mt-2'>
            <Label value='Class Session'  />
            <TextInput
              type='text'
              placeholder='Class Session'
              required
              id='classSession'
              className='flex-1 mt-2'
              onChange={(e) =>
                setFormData({ ...formData, classSession: e.target.value })
              }
            />
          </div>
          <div className='mt-2'>
            <Label value='Course'  />
            <Select
              className='flex-1 mt-2'
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
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
              <Label value='Date'  />
              <TextInput
                type='date'
                required
                id='day'
                className='flex-1 mt-2'
                onChange={(e) =>
                  setFormData({ ...formData, day: e.target.value })
                }
              />
            </div>
            <div className='mt-2 w-4/12 mr-4'>
              <Label value='Start Time'  />
              <TextInput
                type='time'
                required
                id='startTime'
                className='flex-1 mt-2'
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>
            <div className='mt-2 w-4/12'>
              <Label value='End Time'  />
              <TextInput
                type='time'
                required
                id='endTime'
                className='flex-1 mt-2'
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
          </div>
          </div>
          <div className='mt-2'>
            <Label value='Assigned Lecture'  />
            <Select
              className='flex-1 mt-2'
              onChange={(e) =>
                setFormData({ ...formData, faculty: e.target.value })
              }
            >
              <option value='No'>Select Lecturer</option>
              <option value='65faafe26a08c9c2d231e3d6'>Mr. Pasan Fernando</option>
              <option value='65faaffa6a08c9c2d231e3d8'>Mr. Dananjaya Abesinghe</option>
              <option value='65fa98425e8a62d5e954e25f'>Mr. Avishka Rathnakumara</option>
              <option value='65fab0136a08c9c2d231e3da'>Mrs. Sudarika Chethani</option>
              <option value='65fab02a6a08c9c2d231e3dc'>Mrs. Dimesha Wijerathne</option>
            </Select>
          </div>
          <div className='mt-2'>
            <Label value='Location'  />
            <TextInput
              type='text'
              required
              id='location'
              className='flex-1 mt-2'
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>      
        
        {/* Button To Add Time Table */}
        <Button type='submit' gradientDuoTone='purpleToPink'  className=' mt-2'>
          Create Time Table
        </Button>
        {/* Displaying Publish Error */}
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  )
}
