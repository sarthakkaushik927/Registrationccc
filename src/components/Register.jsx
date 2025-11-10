import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

// Input field component
const FormInput = ({ label, name, type, register, rules, error, placeholder }) => (
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

// Dropdown field component
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
      <option value="">Select {label}...</option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-gray-800 text-white">
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

// Main component
export default function Register() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);

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
  const genders = ['Male', 'Female'];
  const residences = ['Day Scholar', 'Hosteller'];

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      console.log("Form data before submission:", data);
      console.log("Captcha Token:", captchaToken);

      if (!captchaToken) {
        setSubmitError("Please complete the CAPTCHA before submitting.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        'https://spocc-registration-form-backend.vercel.app/api/v1/register',
        {
          ...data,
          captchaToken: captchaToken, // ✅ Correct key name
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('API Response:', response.data);
      setSubmittedData(data);
      setSubmitSuccess(true);
      reset();
      setCaptchaToken(null);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);
      const apiErrorMessage =
        error.response?.data?.message || 'Failed to register. Please try again later.';
      setSubmitError(apiErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const videoSource = 'https://www.w3schools.com/howto/rain.mp4';

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex font-sans">
      {/* Background Video */}
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover z-0 opacity-50">
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white text-center p-6 rounded-xl border border-gray-600 backdrop-blur-md bg-white bg-opacity-10 max-w-lg"
        >
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Welcome to the Future!</h2>
          <p className="text-lg leading-relaxed text-gray-200 drop-shadow-md">
            Register now to explore new opportunities and connect with a vibrant community.
          </p>
        </motion.div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-md border border-gray-700"
        >
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Student Registration</h1>

          {/* Error Message */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-red-700 bg-opacity-40 border border-red-500 text-red-200 px-4 py-3 rounded-lg relative mb-6"
              >
                <strong className="font-bold">Error!</strong> {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-green-700 bg-opacity-40 border border-green-500 text-green-200 px-4 py-3 rounded-lg relative mb-6"
              >
                <strong className="font-bold">Success!</strong> Form submitted successfully.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                name="name"
                type="text"
                placeholder="e.g. rohan (min 3 lowercase letters)"
                register={register}
                rules={{
                  required: 'First name is required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                  pattern: { value: /^[A-Za-z ]+$/, message: 'Only letters are allowed' },
                }}
                error={errors.name}
              />
              <FormInput
                label="Student Number"
                name="studentNumber"
                type="text"
                placeholder="e.g. 2412345"
                register={register}
                rules={{
                  required: 'Student number is required',
                  pattern: { value: /^24\d{5,7}$/, message: 'Must start with 24 (7–9 digits)' },
                }}
                error={errors.studentNumber}
              />
            </div>

            <FormInput
              label="College Email"
              name="email"
              type="email"
              placeholder={`e.g. [name]${studentNumber || 'studentnumber'}@akgec.ac.in`}
              register={register}
              rules={{
                required: 'College email is required',
                validate: (value) => {
                  if (!studentNumber) return 'Please fill Student Number first';
                  const expectedRegex = new RegExp(`^[a-z]{3,}${studentNumber}@akgec\\.ac\\.in$`);
                  return expectedRegex.test(value) || `Must be [name]${studentNumber}@akgec.ac.in`;
                },
              }}
              error={errors.email}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Gender"
                name="gender"
                register={register}
                rules={{ required: 'Select a gender' }}
                error={errors.gender}
                options={genders}
              />
              <FormSelect
                label="Branch"
                name="branch"
                register={register}
                rules={{ required: 'Select a branch' }}
                error={errors.branch}
                options={branches}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="e.g. 9876543210"
                register={register}
                rules={{
                  required: 'Phone number is required',
                  pattern: { value: /^[6-9]\d{9}$/, message: 'Must be 10 digits starting 6–9' },
                }}
                error={errors.phone}
              />
              <FormInput
                label="Unstop ID"
                name="unstopId"
                type="text"
                placeholder="e.g. learner123"
                register={register}
                rules={{
                  required: 'Unstop ID is required',
                  maxLength: { value: 20, message: 'Max 20 characters' },
                  pattern: {
                    value: /^[a-zA-Z]{3,}[0-9]*$/,
                    message: 'Start with 3+ letters, can contain numbers',
                  },
                }}
                error={errors.unstopId}
              />
            </div>

            <FormSelect
              label="Residence"
              name="residence"
              register={register}
              rules={{ required: 'Select residence' }}
              error={errors.residence}
              options={residences}
            />

            {/* ✅ Single reCAPTCHA */}
            <div className="mt-4 flex justify-center">
              <ReCAPTCHA
                sitekey="6LflnwUsAAAAAAqESrSBRCGsRPhtQjuvd1CjXbaf"
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Register'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
