import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuthState, resetPassword, sendResetOtp } from '../../redux/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';

const ResetPassword = () => {

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }

  //Sending Email
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sendResetOtp({ email })).unwrap();   //.unwrap is used
      toast.success('OTP sent to your email!');
      setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP.');
    } finally {
      dispatch(clearAuthState());
    }
  };


  //Submiting OTP
  const onSubmitOtp = (e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''))
    setIsOtpSubmited(true)
  }

  //Reset Password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault()

    try {
      const result = await dispatch(resetPassword({ email, otp, newPassword })).unwrap();
      toast.success(result.message || "Password reset successfully");
      navigate(`/${user?.role}`);

    } catch (error) {
      toast.error(error.message, "Failed to reset Password")
    } finally {
      dispatch(clearAuthState());
    }
  }

  if (loading) return <Spinner />

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

      {/* Enter Email form  */}
      {!isEmailSent &&
        <form
          onSubmit={onSubmitEmail}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address.</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} className='w-3 h-3' />
            <input
              type="email"
              placeholder='Enter email'
              className='bg-transparent outline-none text-white'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mt-3 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Submit'}
          </button>
        </form>
      }

      {/* OTP input form  */}
      {!isOtpSubmited && isEmailSent &&
        <form
          onSubmit={onSubmitOtp}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'
        >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => {
              return <input type="text" maxLength='1' key={index} required
                className='w-12 h-12 bg-[#333A5C] text-white text-xl text-center rounded-md'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            })}
          </div>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>Submit</button>
        </form>
      }

      {/* New password form */}
      {isOtpSubmited && isEmailSent &&
        <form
          onSubmit={onSubmitNewPassword}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your new password.</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} className='w-3 h-3' />
            <input
              type="password"
              placeholder='Enter Password'
              className='bg-transparent outline-none text-white'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium mt-3 disabled:opacity-50"
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      }
    </div>
  )
}

export default ResetPassword