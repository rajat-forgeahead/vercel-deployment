'use client'
import Link from 'next/link';
import React, { useEffect,useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';
import { countries } from "../utils/countryData"
// import { useTheme } from "next-themes";

export default function LoginScreen() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [states, setStates] = useState([]); 
  const [cities, setCities] = useState([]); 
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { redirect } = router.query;
  const handleFileChange = (event) => {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFile(e.target.result);
      };
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        // Save base64 string to local storage
        localStorage.setItem(email, base64String);
      };
      reader.readAsDataURL(image);
    }

  };

  
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);
  // const isValidEmail = (email) => {
  //   const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  //   return emailRegex.test(email);
  // };
  // const isValidPassword = (password) => {
  //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s])(.{8,})$/;
  //   return passwordRegex.test(password);
  // };

  const handleCountrySelect = (e) => {
    console.log("country event",e)
    const selectedCountry = countries?.find(
      (ctr) => ctr.name === e.target.value
      
    );
    register('country')
    const selectedStates = selectedCountry?.states;
    if (selectedStates !== undefined) {
      setStates(selectedStates);}
  };
  const handleStateSelect = (e) => {
    const selectedState = states?.find(
      (ctr) => ctr?.name === e.target.value
    );
    const selectedCity = selectedState?.cities;
    if (selectedCity !== undefined) {
      setCities(selectedCity);
      }
  };
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password,bio, phone_number, address, country, city, state }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
        bio,
        phone_number,
        address,
        country,
        city,
        state
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }else{
        const userData = {
          name:name,
         email: email,
         password : password,
         bio: bio,
         phone_number: phone_number,
         address: address,
         countries: country,
         city: city,
         state: state
        }
        let key =  email+"data"
        localStorage.setItem(key, JSON.stringify(userData));
        router.replace("/dashboard");
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Create Account">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Create Account</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register('name', {
              required: 'Please enter name',
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <span style={{ color: 'red' }}>*</span>
          <input
            type="email"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <span style={{ color: 'red' }}>*</span>
          <input
            type="password"
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
              pattern: {
                value:  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s])(.{8,})$/,
                message: 'Password must be at least 5 characters long and contain at least one special character and one uppercase letter.',
              },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <span style={{ color: 'red' }}>*</span>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please enter confirm password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password is more than 5 chars',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>
        <div>
                  <label>
                    Your Address
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    {...register('address', {
                      required: 'Please enter address',
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="street"
                    required
                  />
                </div>
                <div>
                  <label>
                    Select your country
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register('country', {
                      required: 'Please enter country',
                    })}
                    onChange={handleCountrySelect}
                    required
                  >
                    <option disabled selected>
                   
                    </option>
                    {countries?.map((ctr) => (
                      <option key ={ctr.name} value={ctr.name}>{ctr.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>
                    Select your State
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    {...register('state', {
                      required: 'Please enter state',
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleStateSelect}
                  >
                    <option disabled selected>
              
                    </option>
                    {states?.map((ctr) => (
                      <option  key ={ctr.name} value={ctr.name}>{ctr.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>
                    Select your City
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    {...register('city', {
                      required: 'Please enter city',
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option disabled selected>
               
                    </option>
                    {cities?.map((ctr) => (
                      <option  key ={ctr} value={ctr}>{ctr}</option>
                    ))}
                  </select>
                </div>
            
        <div>
                    <label>
                      Upload file
                    </label>
                    <div className="flex justify-center items-center py-4">
                    {file && <img className="rounded w-36 h-36"src={file} alt="Uploaded" width={200} />}
                    </div>
                    
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      id="file_input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {/* <h1>Upload Profile Picture</h1>
                    {image && <img src={image} alt="Uploaded" width={200} />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    /> */}
                  </div>
                <div>
                  <label>
                    Your phone no.
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="phone_number"
                    id="phone_number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register('phone_number', {
                      required: 'Please enter phone number',
                    })}
                    placeholder="1234567890"
                    required
                  />
                </div>
                <div>
                  <label >
                    Your bio
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    name="bio"
                    id="bio"
                    {...register('bio', {
                      required: 'Please enter bio',
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="abc"
                    
                    required
                  />
                </div>
                
      

        <div className="mb-4 mt-5 ">
          <button type="submit" className="primary-button">Register</button>
        </div>
        <div className="mb-4 ">
         Have an account? &nbsp;
          <Link href={`/login?redirect=${redirect || '/'}`}>Login</Link>
        </div>
      </form>
    </Layout>
  );
}
