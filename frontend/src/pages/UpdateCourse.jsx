import { Alert, Button, FileInput, Label, Select, TextInput } from 'flowbite-react';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateCourse() {
  // State Variables
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({}); // Form Data State
  const [publishError, setPublishError] = useState(null); // Publish Error State
  const { courseId } = useParams(); // Get Course ID From URL Params

  const navigate = useNavigate(); // Navigation Hook
    const { currentUser } = useSelector((state) => state.user); // Redux Hook to Get Current User

  // Fetch Course Data When CourseId Changes  
  useEffect(() => {
    try {
      const fetchCourse = async () => {
        const res = await fetch(`/api/course/getcourses?courseId=${courseId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.courses[0]);
        }
      };

      fetchCourse();
    } catch (error) {
      console.log(error.message);
    }
  }, [courseId]);

  // Function to Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/course/updatecourse/${formData._id}`, {
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

      if (res.ok) {
        setPublishError(null);
        navigate(`/dashboard?tab=courses`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen mt-10'>
      <div>
          <h1 className="text-3xl text-red-600 text-center font-serif uppercase "> - Update Course - </h1>
          <hr className="my-4 border-gray-300 dark:border-gray-600" />
      </div>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/* Course Name Input */}
        <div className='mt-2'>
          <Label value='Course Name'  />
          <TextInput
            type='text'
            placeholder='Course Name'
            required
            id='courseName'
            className='flex-1 mt-2'
            onChange={(e) =>
              setFormData({ ...formData, courseName: e.target.value })
            }
            value={formData.courseName}
          />
        </div>
        {/* Course Code Input */}
        <div className='mt-2'>
          <Label value='Course Code'  />
          <TextInput
            type='text'
            placeholder='Course Code'
            required
            id='courseCode'
            className='flex-1 mt-2'
            onChange={(e) =>
              setFormData({ ...formData, courseCode: e.target.value })
            }
            value={formData.courseCode}
          />
        </div>  
        {/* Course Description Input */}
        <div className='mt-2'>
          <Label value='Course Description'  />
          <TextInput
            type='text'
            placeholder='Course Description'
            required
            id='courseDescription'
            className='flex-1 mt-2'
            onChange={(e) =>
              setFormData({ ...formData, courseDescription: e.target.value })
            }
            value={formData.courseDescription}
          />
        </div>  
        {/* Course Credit Input */}
        <div className='mt-2'>
          <Label value='Course Credit'  />
          <Select
            className='mt-2'
            onChange={(e) =>
              setFormData({ ...formData, courseCredit: e.target.value })
            }
            value={formData.courseCredit}
          >
            <option value='No'>Select Credit Point</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
          </Select>
        </div>
        {/* Enrolled Faculty Input */}
        <div className='mt-2'>
          <Label value='Assign Faculty'  />
          <Select
            className='mt-2'
            onChange={(e) =>
              setFormData({ ...formData, enrolledfaculty: e.target.value })
            }
            value={formData.enrolledfaculty}
          >
            <option value='No'>Select Lecturer</option>
            <option value='65faafe26a08c9c2d231e3d6'>Mr. Pasan Fernando</option>
            <option value='65faaffa6a08c9c2d231e3d8'>Mr. Dananjaya Abesinghe</option>
            <option value='65fa98425e8a62d5e954e25f'>Mr. Avishka Rathnakumara</option>
            <option value='65fab0136a08c9c2d231e3da'>Mrs. Sudarika Chethani</option>
            <option value='65fab02a6a08c9c2d231e3dc'>Mrs. Dimesha Wijerathne</option>
          </Select>
        </div>

        {/* Button To Submit Form */}
        <Button type='submit' gradientDuoTone='purpleToPink' className='mt-2'>
          Update Course
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