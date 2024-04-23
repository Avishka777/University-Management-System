import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  
  // State Variables
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user); // Redux Selector For Loading State And Error Message
  const dispatch = useDispatch(); // Redux Dispatch Function
  const navigate = useNavigate(); // Navigation Hook

  // Function To Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  // Function To Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please Fill All The Fields.')); // Dispatch Failure Action If Fields Are Empty
    }
    try {
      dispatch(signInStart()); // Dispatch Start Action
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message)); // Dispatch Failure Action If Sign-In Fails
      }
      if (res.ok) {
        dispatch(signInSuccess(data)); // Dispatch Success Action If Sign-In Succeeds
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message)); // Dispatch Failure Action If An Error Occurs
    }
  };
  
  return (
    <div className='min-h-screen mt-10'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <div>
            <h1 className="text-3xl text-red-600 text-center font-serif uppercase"> - Sign In - </h1>
            <hr className="my-4 border-gray-300 dark:border-gray-600" />
          </div>
          {/* Sign-In Form */}
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='mt-2'>
              <Label value='Your Email' />
              <TextInput
                type='email'
                placeholder='reg.no@uni.lk'
                id='email'
                onChange={handleChange}
                className='mt-2'
              />
            </div>
            <div className='mt-2'>
              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                onChange={handleChange}
                className='mt-2'
              />
            </div>
            {/* Sign-In Button */}
            <Button
            className='my-2'
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            {/* Google OAuth Component */}
            <OAuth />
          </form>     
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}