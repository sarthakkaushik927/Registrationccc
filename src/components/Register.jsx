import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

import axios from 'axios';


const FormInput = ({
  label,
  name,
  type,
  register,
  rules,
  error,
  placeholder,
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      placeholder={placeholder}
      {...register(name, rules)}
      className={`w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-600'
      }`}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-400 text-xs mt-1"
        >
          {error.message}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);


const FormSelect = ({ label, name, register, rules, error, options }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
      {label}
    </label>
    <select
      id={name}
      {...register(name, rules)}
      className={`w-full p-3 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-600'
      }`}
    >
      <option value="" className="bg-gray-700 text-gray-400">
        Select {label}...
      </option>
      {options.map((option) => (
        <option key={option} value={option.toLowerCase().replace(/\s+/g, '-')} className="bg-gray-800 text-white">
          {option}
        </option>
      ))}
    </select>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-400 text-xs mt-1"
        >
          {error.message}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// --- Main App Component ---
export default function App() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [submitError, setSubmitError] = useState(null); // For API errors

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: 'onBlur',
  });

  const studentNumber = watch('studentNumber');

  const branches = [
    'CSE', 'CSE (AIML)', 'CSE (DS)', 'AIML', 'CS', 'CS (H)', 'IT', 'CSIT', 'ECE', 'EEE', 'Civil', 'Mechanical'
  ];
  const genders = ['Male', 'Female', 'Other']; 
  const residences = ['Day Scholar', 'Hosteller'];

  const onSubmit = async (data) => {
    setIsLoading(true); 
    setSubmitError(null); 
    setSubmitSuccess(false);
    
   
    try {
      /*
     
      const response = await axios.post('/api/register', data, {
         headers: { 'Content-Type': 'application/json' }
      });

      console.log('API Response:', response.data);
      */

   
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      console.log('Form data submitted:', data);
      setSubmittedData(data); 
      setSubmitSuccess(true); 

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 4000);

    } catch (error) {
     
      console.error('API Error:', error.response ? error.response.data : error.message);
      setSubmitError('Failed to register. Please try again later.'); 
    } finally {
      setIsLoading(false); 
    }
  };

  const videoSource = "https://www.w3schools.com/howto/rain.mp4"; 

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex font-sans">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-90" 
        
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken video further and ensure text readability */}
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

      {/*Left */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-8 z-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-white text-center p-6 rounded-xl border border-gray-600 backdrop-blur-md bg-transparent bg-opacity-10 max-w-lg"
        >
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to the Future!
          </h2>
          <p className="text-lg leading-relaxed text-gray-200 drop-shadow-md">
            Register now to explore new opportunities and connect with a vibrant community.
            This space is reserved for your captivating event poster or promotional content!
          </p>
          {/*<img src="..." alt="Poster" className="mt-6 rounded-lg shadow-xl"/> */}
        </motion.div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 z-20">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-md border border-gray-700 transform hover:scale-[1.01] transition-transform duration-300"
          style={{
            borderRadius: '40px', // More pronounced bubble effect
            boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 10px rgba(255,255,255,0.1)'
          }}
        >
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-6 drop-shadow-md">
            Student Registration
          </h1>

          {/* API Error Message */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-red-700 bg-opacity-40 border border-red-500 text-red-200 px-4 py-3 rounded-lg relative mb-6 overflow-hidden"
                role="alert"
              >
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {submitError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-green-700 bg-opacity-40 border border-green-500 text-green-200 px-4 py-3 rounded-lg relative mb-6 overflow-hidden"
                role="alert"
              >
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline">
                  {' '}
                  Form submitted. A confirmation mail has been sent!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <FormInput
                label="First Name"
                name="firstName"
                type="text"
                placeholder="e.g. rohan (min 3 lowercase letters)"
                register={register}
                rules={{
                  required: 'First name is required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                  pattern: {
                    value: /^[a-z]+$/,
                    message: 'Only lowercase letters allowed',
                  },
                }}
                error={errors.firstName}
              />

              {/* Student Number */}
              <FormInput
                label="Student Number"
                name="studentNumber"
                type="text"
                placeholder="e.g. 2412345 (7-9 digits, starts with 24)"
                register={register}
                rules={{
                  required: 'Student number is required',
                  pattern: {
                    value: /^24\d{5,7}$/,
                    message: 'Must be 7-9 digits starting with 24',
                  },
                }}
                error={errors.studentNumber}
              />
            </div>

            {/* College Email */}
            <FormInput
              label="College Email"
              name="collegeEmail"
              type="email"
              placeholder={`e.g. [name]${studentNumber || 'studentnumber'}@akgec.ac.in`}
              register={register}
              rules={{
                required: 'College email is required',
                validate: (value) => {
                  if (!studentNumber) return 'Please fill Student Number first';

                  const expectedRegex = new RegExp(
                    `^[a-z]{3,}${studentNumber}@akgec\\.ac\\.in$`
                  );

                  return (
                    expectedRegex.test(value) ||
                    `Must be [name]${studentNumber}@akgec.ac.in`
                  );
                },
              }}
              error={errors.collegeEmail}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gender */}
              <FormSelect
                label="Gender"
                name="gender"
                register={register}
                rules={{ required: 'Please select a gender' }}
                error={errors.gender}
                options={genders}
              />

              {/* Branch */}
              <FormSelect
                label="Branch"
                name="branch"
                register={register}
                rules={{ required: 'Please select a branch' }}
                error={errors.branch}
                options={branches}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <FormInput
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                placeholder="e.g. 9876543210 (10 digits, starts 6-9)"
                register={register}
                rules={{
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Must be a 10-digit Indian number (starting 6-9)',
                  },
                }}
                error={errors.phoneNumber}
              />

              {/* Unstop ID */}
              <FormInput
                label="Unstop ID"
                name="unstopId"
                type="text"
                placeholder="e.g. learner123 (3+ letters then numbers, max 20 chars)"
                register={register}
                rules={{
                  required: 'Unstop ID is required',
                  maxLength: { value: 20, message: 'Max 20 characters' },
                  pattern: {
                    value: /^[a-zA-Z]{3,}[0-9]*$/, // Changed to allow ID to end with 0 numbers, or start with numbers
                    message: 'Start with 3+ letters, can contain numbers',
                  },
                }}
                error={errors.unstopId}
              />
            </div>

            {/* Residence */}
            <FormSelect
              label="Residence"
              name="residence"
              register={register}
              rules={{ required: 'Please select residence' }}
              error={errors.residence}
              options={residences}
            />

            {/* Submit Button */}
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading} // Disable button when loading
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Register'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* --- Submitted Data Display --- */}
      <AnimatePresence>
        {submittedData && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-4 left-4 lg:left-auto lg:right-4 bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-xl w-11/12 max-w-md text-white border border-gray-700 z-30"
          >
            <h2 className="text-xl font-bold text-blue-300 mb-4">
              Submitted Data
            </h2>
            <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}