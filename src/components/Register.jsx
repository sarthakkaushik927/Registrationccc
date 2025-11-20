import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- CONFIGURATION ---
const branches = [
  'CSE', 'CSE (AIML)', 'CSE (DS)', 'AIML', 'CS', 'CS (H)', 'IT', 'CSIT', 'ECE', 'EEE', 'Civil', 'Mechanical'
];
const genders = ['Male', 'Female'];
const residences = ['Day Scholar', 'Hosteller'];

// --- ZOD VALIDATION SCHEMA ---
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
    .refine(val => /^[0-9]*$/.test(val), { message: "Only numbers are allowed" })
    .refine(val => val.startsWith('24'), { message: "Must start with 24" })
    .refine(val => val.length >= 7 && val.length <= 9, { message: "Must be 7 to 9 digits total" }),
    
  email: z.string({ required_error: "Email is required" })
    .trim()
    .nonempty("Email is required")
    .email("Invalid email format")
    .toLowerCase(),
    
  gender: z.enum(genders, { required_error: 'Select a gender' }),
  branch: z.enum(branches, { required_error: 'Select a branch' }),
  
  phone: z.string({ required_error: "Phone number is required" })
    .trim()
    .nonempty("Phone number is required")
    .refine(val => /^[0-9]*$/.test(val), { message: "Only numbers are allowed" })
    .refine(val => /^[6-9]/.test(val), { message: "Must start with 6, 7, 8, or 9" })
    .refine(val => val.length === 10, { message: "Must be exactly 10 digits" }),
    
  unstopId: z.string({ required_error: "Unstop ID is required" })
    .trim()
    .nonempty("Unstop ID is required")
    .max(20, 'Max 20 characters')
    .refine(val => /^[a-zA-Z0-9]+$/.test(val), { message: "Only letters and numbers allowed" })
    .refine(val => /^[a-zA-Z]/.test(val), { message: "Must start with a letter" })
    .refine(val => /^[a-zA-Z]{3,}/.test(val), { message: "Must start with at least 3 letters" }),
    
  residence: z.enum(residences, { required_error: 'Select residence' }),
    
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

// --- FORM COMPONENTS ---
const FormInput = ({ name, type, register, error, placeholder }) => (
  <div className="mb-1 relative z-0">
    <input
      type={type}
      id={name}
      placeholder={placeholder}
      {...register(name)}
      className={`w-full p-3 border rounded-lg bg-[#2c283d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
        error ? 'border-red-500' : 'border-gray-700'
      }`}
    />
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

const FormSelect = ({ name, register, error, options, placeholder }) => (
  <div className="mb-1 relative z-0">
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

const DelayedCursor = () => {
  const CURSOR_SIZE = 110;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX - CURSOR_SIZE / 2);
      mouseY.set(clientY - CURSOR_SIZE / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        translateX: smoothX,
        translateY: smoothY,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
      }}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-50 backdrop-blur-[2px] border border-white/20 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
    />
  );
};

// --- MAIN PAGE COMPONENT ---
export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  
  // 1. Initialize ref
  const recaptchaRef = useRef(null);

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
    try {
      if (!captchaToken) {
        toast.error("Please complete the CAPTCHA before submitting.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        'https://spocc-registration-form-backend.vercel.app/api/v1/register',
        { ...data, captchaToken: captchaToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('API Response:', response.data);
      toast.success("Success! Form submitted successfully.");
      
      // Reset Form
      reset();
      
      // Reset Captcha State
      setCaptchaToken(null);
      
      // 3. Reset the actual Captcha Widget
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);
      const apiErrorMessage =
        error.response?.data?.message || 'Failed to register. Please try again later.';
      toast.error(`Error! ${apiErrorMessage}`);
      
      // Optional: Reset captcha on error too if you want to force re-verification
      setCaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex font-sans bg-[#0b011f]">
      
      {/* --- THE DELAYED BUBBLE --- */}
      <DelayedCursor />
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="dark"
      />
      
      {/* Left Side - Image */}
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

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#1e1a2f] p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700 relative"
        >
          <h1 className="text-3xl font-serif text-center text-white mb-6">
            Registration Form
          </h1>

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

            <div className="mt-4 flex justify-center relative z-10">
              {/* 2. Attach the ref to ReCAPTCHA */}
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LflnwUsAAAAAAqESrSBRCGsRPhtQjuvd1CjXbaf"
                onChange={(token) => setCaptchaToken(token)}
                theme="dark"
              />
            </div>

            <div className="mt-6 relative z-10">
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