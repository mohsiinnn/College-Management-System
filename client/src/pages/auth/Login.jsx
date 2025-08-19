import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuthState, loginUser, registerUser } from '../../redux/auth/authSlice';
import Spinner from '../../components/Spinner';

const Login = ({ role }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, loading, error, success, message } = useSelector((state) => state.auth)

  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    try {
      if (error) {
        toast.error(message)
      }

      // console.log(error);

      if (success || user) {
        if (user.role === 'superAdmin') {
          navigate('/superAdmin/dashboard');
        }
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        }
        if (user.role === 'student') {
          navigate('/student/dashboard');
        }
        if (user.role === 'teacher') {
          navigate('/teacher/dashboard')
        }

        // console.log( `success is ${success}`,`user is: ${user.role}` );
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      dispatch(clearAuthState())
    }
  }, [user, error, success, message, dispatch, navigate])


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (state === 'Sign Up') {
      const userDate = {
        name,
        email,
        password,
        role
      }
      dispatch(registerUser(userDate))
    }
    else {
      const userData = {
        email,
        password,
        role
      }
      dispatch(loginUser(userData))
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.favicon} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-20 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? "Create Account" : "Login"}</h2>
        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up' ? "Create your account" : "Login to your account"}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white'>
              <img src={assets.person_icon} alt="" />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none' type="text" placeholder='full name' required />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white'>
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none' type="email" placeholder='Enter email' required />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white'>
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none' type="password" placeholder='Enter password' required />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className='mb-4 text-indigo-500 cursor-pointer hover:text-indigo-300'>Forgot password?</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?
            <span onClick={() => setState('Login')}
              className='text-blue-400 cursor-pointer underline'> Login here</span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?
            <span onClick={() => setState('Sign Up')}
              className='text-blue-400 cursor-pointer underline'> Sign Up</span>
          </p>
        )}

      </div>
    </div>
  )
}

export default Login