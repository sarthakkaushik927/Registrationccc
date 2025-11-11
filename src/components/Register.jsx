import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// --- Zod Validation Schema ---
const branches = [
  'CSE', 'CSE (AIML)', 'CSE (DS)', 'AIML', 'CS', 'CS (H)', 'IT', 'CSIT', 'ECE', 'EEE', 'Civil', 'Mechanical'
];
const genders = ['Male', 'Female'];
const residences = ['Day Scholar', 'Hosteller'];

const registrationSchema = z.object({
  name: z.string({ required_error: "Name is required" })
    .trim()
    .nonempty("Name is required")
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be 50 characters or less')
    .regex(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
    
  studentNumber: z.string({ required_error: "Student number is required" })
    .trim()
    .nonempty("Student number is required")
    .refine(val => /^[0-9]*$/.test(val), {
      message: "Only numbers are allowed"
    })
    .refine(val => val.startsWith('24'), {
      message: "Must start with 24"
    })
    .refine(val => val.length >= 7 && val.length <= 9, {
      message: "Must be 7 to 9 digits total"
    }),
    
  email: z.string({ required_error: "Email is required" })
    .trim()
    .nonempty("Email is required")
    .email("Invalid email format (e.g., user@domain.com)")
    .toLowerCase(),
    
  gender: z.enum(genders, {
    required_error: 'Select a gender'
  }),
  
  branch: z.enum(branches, {
    required_error: 'Select a branch'
  }),
  
  phone: z.string({ required_error: "Phone number is required" })
    .trim()
    .nonempty("Phone number is required")
    .refine(val => /^[0-9]*$/.test(val), {
      message: "Only numbers are allowed"
    })
    .refine(val => /^[6-9]/.test(val), {
      message: "Must start with 6, 7, 8, or 9"
    })
    .refine(val => val.length === 10, {
      message: "Must be exactly 10 digits"
    }),
    
  unstopId: z.string({ required_error: "Unstop ID is required" })
    .trim()
    .nonempty("Unstop ID is required")
    .max(20, 'Max 20 characters')
    .refine(val => /^[a-zA-Z0-9]+$/.test(val), {
      message: "Only letters and numbers allowed"
    })
    .refine(val => /^[a-zA-Z]/.test(val), {
      message: "Must start with a letter"
    })
    .refine(val => /^[a-zA-Z]{3,}/.test(val), {
      message: "Must start with at least 3 letters"
    }),
    
  residence: z.enum(residences, {
    required_error: 'Select residence'
  }),
    
}).superRefine((data, ctx) => {
  if (data.email) {
    if (!data.name) {
      ctx.addIssue({ code: "custom", message: "Please fill Name first", path: ["email"] });
      return;
    }
    if (!data.studentNumber) {
      ctx.addIssue({ code: "custom", message: "Please fill Student Number first", path: ["email"] });
      return;
    }

    const namePrefix = data.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
    
    if (namePrefix.length === 0) {
      ctx.addIssue({ code: "custom", message: "Valid name needed", path: ["name"] });
      ctx.addIssue({ code: "custom", message: "Valid name needed to check email", path: ["email"] });
      return;
    }

    const expectedEmail = `${namePrefix}${data.studentNumber}@akgec.ac.in`;
    
    if (data.email.toLowerCase() !== expectedEmail) {
      ctx.addIssue({
        code: "custom",
        message: `Student Number must match the College ID (e.g., ${expectedEmail})`,
        path: ["email"],
      });
    }
  }
});
// --- End of Schema ---

// Input field component
const FormInput = ({ name, type, register, error, placeholder }) => (
  <div className="mb-1">
    <input
      type={type}
      id={name}
      placeholder={placeholder}
      {...register(name)}
      className={`w-full p-3 border rounded-lg bg-[#2c283d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
        error ? 'border-red-500' : 'border-gray-700'
      }`}
    />
    {/* ✅ FIX: Changed h-5 to min-h-[1.25rem] (which is min-h-5) */}
    <div className="min-h-[1.25rem]">
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
  </div>
);

// Dropdown field component
const FormSelect = ({ name, register, error, options, placeholder }) => (
  <div className="mb-1">
    <select
      id={name}
      {...register(name)}
      className={`w-full p-3 border rounded-lg bg-[#2c283d] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
        error ? 'border-red-500' : 'border-gray-600'
      } ${!register(name).value ? 'text-gray-400' : 'text-white'}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-gray-800 text-white">
          {option}
        </option>
      ))}
    </select>
    {/* ✅ FIX: Changed h-5 to min-h-[1.25rem] (which is min-h-5) */}
    <div className="min-h-[1.25rem]">
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
  </div>
);

// Main component
export default function Register() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });

  const watchedName = watch('name');
  const watchedStudentNumber = watch('studentNumber');
  const watchedEmail = watch('email'); 

  useEffect(() => {
    if (watchedEmail) {
      trigger('email');
    }
  }, [watchedName, watchedStudentNumber, trigger, watchedEmail]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (!captchaToken) {
        setSubmitError("Please complete the CAPTCHA before submitting.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        'https://spocc-registration-form-backend.vercel.app/api/v1/register',
        { ...data, captchaToken: captchaToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('API Response:', response.data);
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex font-sans bg-[#0b011f]">
      
      <div className="hidden lg:flex w-1/2 items-center justify-center p-8 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-full max-w-lg h-[600px] bg-cover bg-center rounded-2xl p-6"
          style={{ backgroundImage: "url('path/to/your/classroom-image.jpg')" }} 
        >
          <div className="relative z-10 flex flex-col justify-between h-full">
            <span className="text-4xl text-white opacity-75">
              &#x2699;
            </span>
            <div className="flex-grow flex items-center justify-center">
              <div className="p-4 bg-black bg-opacity-30 backdrop-blur-md rounded-full">
                <span className="text-8xl text-white">
                  &#x1F4D6;
                </span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-black opacity-40 rounded-2xl"></div>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#1e1a2f] p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700"
        >
          <h1 className="text-3xl font-serif text-center text-white mb-6">
            Registration Form
          </h1>

          <div className="min-h-[60px]">
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-700 bg-opacity-40 border border-red-500 text-red-200 px-4 py-3 rounded-lg relative mb-4"
                >
                  <strong className="font-bold">Error!</strong> {submitError}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-green-700 bg-opacity-40 border border-green-500 text-green-200 px-4 py-3 rounded-lg relative mb-4"
                >
                  <strong className="font-bold">Success!</strong> Form submitted successfully.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormInput
              name="name"
              type="text"
              placeholder="Enter Name"
              register={register}
              error={errors.name}
            />
            <FormInput
              name="studentNumber"
              type="text"
              placeholder="Enter Student Number"
              register={register}
              error={errors.studentNumber}
            />
            <FormInput
              name="email"
              type="email"
              placeholder="Enter College Email Id"
              register={register}
              error={errors.email}
            />
            <FormSelect
              name="gender"
              placeholder="Select Gender"
              register={register}
              error={errors.gender}
              options={genders}
            />
            <FormSelect
              name="branch"
              placeholder="Branch"
              register={register}
              error={errors.branch}
              options={branches}
            />
            <FormInput
              name="phone"
              type="tel"
              placeholder="Enter Phone Number"
              register={register}
              error={errors.phone}
            />
            
            <FormInput
              name="unstopId"
              type="text"
              placeholder="Enter Unstop ID"
              register={register}
              error={errors.unstopId}
            />
            
            <FormSelect
              name="residence"
              placeholder="Select residence"
              register={register}
              error={errors.residence}
              options={residences}
            />

            <div className="mt-4 flex justify-center">
              <ReCAPTCHA
                sitekey="6LflnwUsAAAAAAqESrSBRCGsRPhtQjuvd1CjXbaf"
                onChange={(token) => setCaptchaToken(token)}
                theme="dark"
              />
            </div>

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}