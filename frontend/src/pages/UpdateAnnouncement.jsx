import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable,} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateAnnouncement() {
  // State Variables
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // Image Upload Progress State
  const [imageUploadError, setImageUploadError] = useState(null); // Image Upload Error State
  const [formData, setFormData] = useState({}); // Form Data State
  const [publishError, setPublishError] = useState(null); // Publish Error State
  const { announcementId } = useParams(); // Get Announcement ID From URL Params

  const navigate = useNavigate(); // Navigation Hook
    const { currentUser } = useSelector((state) => state.user); // Redux Hook to Get Current User

  // Fetch Announcement Data When AnnouncementId Changes  
  useEffect(() => {
    try {
      const fetchAnnouncement = async () => {
        const res = await fetch(`/api/announcement/getannouncements?announcementId=${announcementId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.announcements[0]);
        }
      };

      fetchAnnouncement();
    } catch (error) {
      console.log(error.message);
    }
  }, [announcementId]);

  // Function to Handle Image Upload
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image Upload Failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  // Function to Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/announcement/updateannouncement/${formData._id}`, {
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
        navigate(`/announcement/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen mt-10'>
      <div>
          <h1 className="text-3xl text-red-600 text-center font-serif uppercase "> - Update Announcement - </h1>
          <hr className="my-4 border-gray-300 dark:border-gray-600" />
      </div>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          {/* Title Input */}
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          {/* Category Input */}
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value='uncategorized'>Select a Faculty</option>
            <option value='All Students'>All Students</option>
            <option value='Faculty of Computing'>Faculty of Computing</option>
            <option value='Faculty of Engineering'>Faculty of Engineering</option>
            <option value='Faculty of Business'>Faculty of Business</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          {/* File Input for Image Upload */}
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          {/* Button to Upload Image */}
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {/* Display Image Preview If Image Is Uploaded */}
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        {/* ReactQuill Editor For Content */}
        <ReactQuill
          theme='snow'
          value={formData.content}
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        {/* Button To Submit Form */}
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Update Announcement
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