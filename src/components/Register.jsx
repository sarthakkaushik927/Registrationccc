import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { NetworkBackground } from './NetworkBackground';
import { SplashScreen } from './SplashScreen';
import { FormInput, FormSelect } from './FormComponents';

// --- CONFIGURATION ---
const branches = ['CSE', 'CSE (AIML)', 'CSE (DS)', 'AIML', 'CS', 'CS (H)', 'IT', 'CSIT', 'ECE', 'EEE', 'Civil', 'Mechanical'];
const genders = ['Male', 'Female'];
const residences = ['Day Scholar', 'Hosteller'];

// --- ZOD SCHEMA ---
const registrationSchema = z.object({
  name: z.string().trim().nonempty("Name is required").min(3, 'Min 3 chars').max(50).regex(/^[A-Za-z ]+$/, 'Letters only'),
  studentNumber: z.string().trim().nonempty("Required").refine(val => /^[0-9]*$/.test(val), "Numbers only").refine(val => val.startsWith('24'), "Must start with 24").refine(val => val.length >= 7 && val.length <= 9, "7-9 digits"),
  email: z.string().trim().nonempty("Required").email("Invalid email").toLowerCase(),
  gender: z.enum(genders, { required_error: 'Select gender' }),
  branch: z.enum(branches, { required_error: 'Select branch' }),
  phone: z.string().trim().nonempty("Required").refine(val => /^[0-9]*$/.test(val), "Numbers only").refine(val => /^[6-9]/.test(val), "Start with 6-9").refine(val => val.length === 10, "10 digits"),
  unstopId: z.string().trim().nonempty("Required").max(20).refine(val => /^[a-zA-Z]/.test(val), "Start with letter"),
  residence: z.enum(residences, { required_error: 'Select residence' }),
});

// --- CURSOR ---
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
      style={{ translateX: smoothX, translateY: smoothY, width: CURSOR_SIZE, height: CURSOR_SIZE }}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-40 backdrop-blur-[1px] border border-blue-400/20 bg-blue-500/5 shadow-[0_0_15px_rgba(0,100,255,0.1)] hidden md:block"
    />
  );
};

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const recaptchaRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (!captchaToken) {
        toast.error("Complete CAPTCHA");
        setIsLoading(false);
        return;
      }
      const response = await axios.post(
        'https://spocc-registration-form-backend.vercel.app/api/v1/register',
        { ...data, captchaToken: captchaToken },
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast.success("Registration Successful!");
      reset();
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans bg-[#000000] text-white selection:bg-blue-500/30">
      <DelayedCursor />
      
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
         <NetworkBackground />
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {!showSplash && (
        <div className="relative z-10 flex flex-col min-h-screen">
          
          {/* === MAIN CONTENT WRAPPER === */}
          <div className="flex flex-col lg:flex-row flex-grow w-full">
            
            {/* === LEFT SIDE (Event Info) === 
                Desktop: Sticky/Fixed while scrolling.
                Mobile: Standard Top Block.
            */}
            <div className="w-full lg:w-1/2 relative">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    // Sticky logic: Stays fixed on desktop viewport as you scroll the form
                    className="lg:sticky lg:top-0 lg:h-screen flex items-center justify-center p-8 lg:p-12"
                >
                    <div className="text-center lg:text-left max-w-lg relative z-10 p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="8">
                                <circle cx="35" cy="35" r="25" />
                                <circle cx="65" cy="35" r="25" />
                                <circle cx="50" cy="65" r="25" />
                            </svg>
                            <span className="font-bold tracking-widest text-xl">CCC</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                            Future of <br/> <span className="text-[#00aaff]">Cloud</span>
                        </h1>
                        <p className="text-gray-400 text-base leading-relaxed mb-8">
                            Think, Develop, and Deploy your ideas into reality.
                        </p>
                        <div className="inline-flex gap-8 bg-black/40 border border-[#00aaff]/30 rounded-xl p-4">
                            <div>
                                <p className="text-[10px] text-blue-300 uppercase tracking-wider">Date</p>
                                <p className="font-bold text-sm">Oct 24, 2024</p>
                            </div>
                            <div className="w-px h-10 bg-[#00aaff]/30"></div>
                            <div>
                                <p className="text-[10px] text-blue-300 uppercase tracking-wider">Venue</p>
                                <p className="font-bold text-sm">Main Auditorium</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* === RIGHT SIDE (Form Only) === */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:py-12">
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-[400px]"
                >
                    <div className="relative p-1 rounded-[30px]">
                        {/* Outer Glow Border */}
                        <div className="absolute inset-0 rounded-[30px] border border-[#0066cc]/40 pointer-events-none shadow-[0_0_20px_rgba(0,100,255,0.15)]"></div>

                        <div className="relative bg-black/80 backdrop-blur-xl rounded-[28px] px-6 py-8 border border-white/5">
                            
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white tracking-wide">Registration Form</h2>
                                <p className="text-gray-400 text-sm mt-1 font-light">Event Name</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
                                <div className="grid grid-cols-1 gap-0">
                                    <FormInput name="name" type="text" placeholder="Enter Name" register={register} error={errors.name} />
                                    <FormInput name="studentNumber" type="text" placeholder="Enter Student Number" register={register} error={errors.studentNumber} />
                                    <FormInput name="email" type="email" placeholder="Enter College Email Id" register={register} error={errors.email} />
                                    <FormSelect name="gender" placeholder="Select Gender" register={register} error={errors.gender} options={genders} />
                                    <FormSelect name="branch" placeholder="Branch" register={register} error={errors.branch} options={branches} />
                                    <FormInput name="phone" type="tel" placeholder="Enter Phone Number" register={register} error={errors.phone} />
                                    <FormInput name="unstopId" type="text" placeholder="Enter Unstop Id or (NaN)" register={register} error={errors.unstopId} />
                                    <FormSelect name="residence" placeholder="Select Residence" register={register} error={errors.residence} options={residences} />
                                </div>

                                <div className="mt-2 flex justify-center scale-90 origin-center">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey="6LflnwUsAAAAAAqESrSBRCGsRPhtQjuvd1CjXbaf"
                                        onChange={(token) => setCaptchaToken(token)}
                                        theme="dark"
                                        size="normal"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0,130,255,0.5)" }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-5 bg-gradient-to-b from-[#0055aa] to-[#003366] border border-[#00aaff]/50 text-white py-3 rounded-lg font-bold tracking-wider shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:brightness-110 transition-all"
                                >
                                    {isLoading ? 'Processing...' : 'Register'}
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
          </div>

          {/* === FOOTER SECTION (Full Width, Bottom of Page) === */}
          <div className="w-full relative z-10 border-t border-blue-900/30 bg-black/60 backdrop-blur-md mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
                
                {/* Social Icons */}
                <div className="flex justify-center gap-6 mb-8">
                    {['facebook', 'linkedin', 'instagram'].map((social) => (
                            <motion.div 
                            key={social} 
                            whileHover={{ scale: 1.2, color: "#00aaff", borderColor: "#00aaff" }}
                            className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 cursor-pointer bg-black/50 transition-all duration-300"
                            >
                            <span className="sr-only">{social}</span>
                            {/* Simple Icon Placeholders - Replace with actual Icons if needed */}
                            <div className="w-4 h-4 bg-current rounded-sm opacity-50"></div>
                            </motion.div>
                    ))}
                </div>

                {/* Main Text */}
                <h3 className="font-serif text-3xl lg:text-4xl text-white mb-3">
                    Be part of the future of <span className="font-bold text-[#00aaff] drop-shadow-[0_0_10px_rgba(0,170,255,0.5)]">Cloud Computing</span>
                </h3>
                
                <p className="text-xs lg:text-sm text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
                    Empowering students to innovate, collaborate, and lead in the world of technology.
                </p>

                {/* Bottom Logo Grid Effect */}
                <div className="w-full max-w-lg relative pt-6 border-t border-white/10">
                    <p className="font-serif text-sm tracking-[0.3em] text-white/80 mb-3">Think.Develop.Deploy</p>
                    
                    <div className="flex items-center justify-center gap-3">
                            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="8">
                            <circle cx="35" cy="35" r="25" />
                            <circle cx="65" cy="35" r="25" />
                            <circle cx="50" cy="65" r="25" />
                        </svg>
                        <span className="font-bold tracking-widest text-lg lg:text-xl">CLOUD COMPUTING CELL</span>
                    </div>
                </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}