import { Alert, Button, FileInput, Label, Select, TextInput } from 'flowbite-react';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function CreateClassroom() {
  
  // State Variables To 
 const [formData, setFormData] = useState({});
 const [publishError, setPublishError] = useState<string | null>(null);

 // Hook For Navigation
 const navigate = useNavigate();

 // Function To Handle Form Submission
 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const res = await fetch('/api/classroom/create', {
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
       navigate(`/dashboard?tab=classrooms`);
     }
   } catch (error) {
    setPublishError('Something Went Wrong');
   }
 };

  return (
    
    <div className='p-3 max-w-3xl mx-auto min-h-screen mt-10'>
      <div>
          <h1 className="text-3xl text-red-600 text-center font-serif uppercase shadow-lg"> - Create Class Room - </h1>
          <hr className="my-4 border-gray-300 dark:border-gray-600" />
      </div>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      {/* Input For Assigned Lecture */}
      <div className='mt-2'>
            <Label value='Assigned Lecture'  />
            <Select
              className='flex-1 mt-2'
              onChange={(e) =>
                setFormData({ ...formData, lectureID: e.target.value })
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
          <div className='flex flex-row mx-auto justify-between w-full'>
            <div className='mt-2 w-4/12 mr-4'>
              <Label value='Date'  />
              <TextInput
                type='date'
                required
                id='date'
                className='flex-1 mt-2'
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
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
          {/* Input Fields For Room Name */}
          <div className='mt-2'>
            <Label value='Room Name'  />
            <TextInput
              type='text'
              required
              id='roomName'
              className='flex-1 mt-2'
              onChange={(e) =>
                setFormData({ ...formData, roomName: e.target.value })
              }
            />
          </div>
          {/* Input Fields For Capasity */}
          <div className='mt-2'>
            <Label value='Capacity'  />
            <TextInput
              type='text'
              required
              id='capacity'
              className='flex-1 mt-2'
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
            />
          </div>
          {/* Input Fields For Facility */}    
          <div className='mt-2'>
            <Label value='Facilities'  />
            <TextInput
              type='text'
              required
              id='facilities'
              className='flex-1 mt-2'
              onChange={(e) =>
                setFormData({ ...formData, facilities: e.target.value })
              }
            />
          </div>
        
        {/* Button To Add Class Room */}
        <Button type='submit' gradientDuoTone='purpleToPink'  className=' mt-2'>
          Create Class Room
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
