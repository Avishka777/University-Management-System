import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
export default function SignUp() {
  
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value.trim();
    setFormData({ ...formData, [id]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok) {
        navigate('/dashboard?tab=users');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='User Name' />
              <TextInput type='text' placeholder='User Name' id='username' onChange={handleChange}/>
            </div>
            <div>
              <Label value='Email' />
              <TextInput type='email' placeholder='Email' id='email' onChange={handleChange}/>
            </div>
            <div>
              <Label value='Password' />
              <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>
            </div>
            <div class="flex items-center">
              <Label value='Is This Faculty User' class="mt-2 mb-2 mr-4 text-m font-medium text-gray-900 dark:text-gray-300"/>
              <input type="checkbox" id='isFaculty' onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {loading ? (
                <><Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : ('Create User')}
            </Button>
          </form>

          {errorMessage && (<Alert className='mt-5' color='failure'>{errorMessage}</Alert>
          )}
        </div>
      </div>
    </div>
  );
}