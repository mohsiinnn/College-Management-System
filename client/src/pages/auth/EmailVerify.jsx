import React, { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthState, verifyAccount } from '../../redux/auth/authSlice';
import { assets } from '../../assets/assets';
import Spinner from '../../components/Spinner';

const OTP_LENGTH = 6;

export default function EmailVerify() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, success, error, message, loading } = useSelector(state => state.auth);


  const [submitted, setSubmitted] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef([]);

  // Effect: only navigate after verify action completes
  useEffect(() => {
    if (!submitted) return;

    if (error) {
      toast.error(message);
      dispatch(clearAuthState());
      setSubmitted(false);
    }

    if (success && user?.role) {
      navigate(`/${user.role}/dashboard`, { replace: true });
      dispatch(clearAuthState());
    }

    // console.log(`success is:${success} and user is: ${user}`);
    

  }, [success, error, message, user, navigate, dispatch, submitted]);


  const handleChange = useCallback((char, index) => {
    if (/^[0-9]?$/.test(char)) {
      const newOtp = [...otpValues];
      newOtp[index] = char;
      setOtpValues(newOtp);
      if (char && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    }
  }, [otpValues]);

  // Key down for backspace navigation
  const handleKeyDown = useCallback((e, index) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otpValues]);

  // Paste full OTP
  const handlePaste = e => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, OTP_LENGTH).split('');
    const newOtp = paste.map((c, i) => (/^[0-9]$/.test(c) ? c : '')).concat(
      Array(OTP_LENGTH).fill('').slice(paste.length)
    );
    setOtpValues(newOtp);
    if (paste.length > 0) inputRefs.current[Math.min(paste.length - 1, OTP_LENGTH - 1)]?.focus();
  };

  // Submit OTP
  const handleSubmit = e => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length === OTP_LENGTH) {
      setSubmitted(true);
      dispatch(verifyAccount({ otp }));
    } else {
      toast.warn('Please enter all 6 digits');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='logo'
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <form
        onSubmit={handleSubmit}
        onPaste={handlePaste}
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'
      >
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Verify Email</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the {OTP_LENGTH}-digit code sent to your email.</p>

        <div className='flex justify-between mb-8'>
          {otpValues.map((val, idx) => (
            <input
              key={idx}
              type='text'
              inputMode='numeric'
              pattern='\d*'
              maxLength={1}
              className='w-12 h-12 bg-[#333A5C] text-white text-xl text-center rounded-md'
              ref={el => (inputRefs.current[idx] = el)}
              value={val}
              onChange={e => handleChange(e.target.value, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
            />
          ))}
        </div>

        <button
          type='submit'
          disabled={loading || submitted}
          className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-50'
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
}
