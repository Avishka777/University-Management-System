import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  
  // State Variables
  const [formData, setFormData] = useState({}); // Form Data State
  const [errorMessage, setErrorMessage] = useState(null); // Error Message State
  const [loading, setLoading] = useState(false); // Loading State
  const navigate = useNavigate(); // Navigation Hook
  
  // Function To Handle Form Input Changes
  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value.trim();
    setFormData({ ...formData, [id]: newValue });
  };
  
  // Function To Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check If Required Fields Are Filled Out
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      // Send Form Data To Server
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // Handle Response From Server
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      // If Acccount Creation Is Successful, Navigate To Dashboard
      if(res.ok) {
        navigate('/dashboard?tab=users');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  
  return (
    
    <div className='min-h-screen mt-10'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
        <div>
          <h1 className="text-3xl text-red-600 text-center font-serif uppercase "> - Create User - </h1>
          <hr className="my-4 border-gray-300 dark:border-gray-600" />
        </div>
          {/* Form For User Creation */}
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='mt-2'>
              <Label value='User Name'  />
              <TextInput type='text' className='mt-2' placeholder='User Name' id='username' onChange={handleChange}/>
            </div>
            <div className='mt-2'>
              <Label value='Email' />
              <TextInput type='email' className='mt-2' placeholder='Email' id='email' onChange={handleChange}/>
            </div>
            <div className='mt-2'>
              <Label value='Password' />
              <TextInput type='password' placeholder='Password' className='mt-2' id='password' onChange={handleChange}/>
            </div>
            <div class="mt-2">
            <Label value='User Type' />
              <select id="role" onChange={handleChange} className="block mt-2 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:focus:border-blue-600">
              <option value="No">Select Role</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
            <div className='rounded py-2 mt-5'>
              <input id="isFaculty" onChange={handleChange}  type="checkbox" value="true" 
              class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
              <Label value='This is Faculty Memeber ( A Faculty Member Has Access To Some Administrative Functions! )' className='ml-4'/>
            </div>
            
            </div>
            <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading} className='mt-2'>
              {loading ? (
                <><Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : ('Create User')}
            </Button>
          </form>

          {/* Display Error Message If Present */}
          {errorMessage && (<Alert className='mt-5' color='failure'>{errorMessage}</Alert>
          )}
        </div>
      </div>
    </div>
  );
}
