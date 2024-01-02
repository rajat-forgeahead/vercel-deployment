import React, { useEffect,useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { countries } from "../utils/countryData"
export default function ProfileScreen() {
  const { data: session } = useSession();
  const [states, setStates] = useState([]); 
  const [cities, setCities] = useState([]); 
  const [userData,setUserData]= useState({});
  const [imageSrc, setImageSrc] = useState("");

  const handleFileChange = (event) => {
    const file = event?.target?.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        let renString = reader?.result;
        const base64String = renString.split(",")[1];
        setImageSrc(base64String);
   
      };

      // Read the image file as a data URL
      reader.readAsDataURL(file);
    }
  };

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();
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
  const handleRemovePhoto = () => {
    let user = session?.user?.email
    // Remove image from local storage
    localStorage.removeItem(user);

    // Clear image from component state
    setImageSrc("");
    toast.success('Rmoved Photo successfully!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  useEffect(() => {
    // setValue('name', session.user.name);
    setValue('email', session.user.email);
    let key = session?.user?.email + "data";
    let userImg = session?.user?.email;
    const storedImage = localStorage.getItem(userImg || "");
    if (storedImage) {
      setImageSrc(storedImage);
      handleFileChange(storedImage);
    }
    const data = localStorage.getItem(key);
    let userData = JSON.parse(data);
    setUserData(userData)
    setValue('name', userData.name);
    setValue('bio', userData.bio);
    setValue('phone_number', userData.phone_number);
    setValue('address', userData.address);
    setValue('country', userData.country);
    setValue('city', userData.city);
    setValue('state', userData.state);

  }, [session.user, setValue]);

  const submitHandler = async ({ name, email,bio, phone_number, address, country, city, state}) => {
    try {
      const userData = {
        name:name,
       email: email,
       bio: bio,
       phone_number: phone_number,
       address: address,
       countries: country,
       city: city,
       state: state
      }
      let key =  email+"data"
      localStorage.setItem(key, JSON.stringify(userData));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <Layout title="Profile">

      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Update Profile</h1>

        <div className="mb-4">
          <label htmlFor="name">Name</label>
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
          <input
            type="email"
            className="w-full"
            id="email"
            disabled
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Upload file
                </label>
                <div className="flex justify-center items-center py-4">
                  {imageSrc && (
                    <img
                      className="rounded w-36 h-36"
                      src={`data:image/png;base64,${imageSrc}`}
                      alt="Uploaded"
                      width={200}
                    />
                  )}
                </div>
              
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                 
                />
                
              </div>
              <div>
              <button
                  onClick={handleRemovePhoto}
                  className="w-1/3 bg-orange-300 mt-5 rounded-lg"
                >
                  Remove photo
                </button>
              </div>
              
   
        <div className="mb-4">
          <label htmlFor="phone_number">Phone number</label>
          <input
            type="number"
            className="w-full"
            id="phone_number"
            {...register('phone_number', {
              required: 'Please enter phone_number',
              pattern: {
                message: 'Please enter valid phone_number',
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.phone_number.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="phone_number">Bio</label>
          <input
            type="text"
            className="w-full"
            id="bio"
            {...register('bio', {
              required: 'Please enter bio',
              pattern: {
                message: 'Please enter valid bio',
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.bio.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="phone_number">Address</label>
          <input
            type="text"
            className="w-full"
            id="address"
            {...register('address', {
              required: 'Please enter address',
              pattern: {
                message: 'Please enter valid address',
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>

        <div>
                  <label >
                    Select your country
                  </label>
                  <select
                    id="country"
                    name="country"
                    
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register('country', {
                      required: 'Please enter country',
                    })}
                    onChange={handleCountrySelect}
                    placeholder={userData.country}
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
        <div className="mb-4 mt-5">
          <button className="primary-button">Update Profile</button>
        </div>
      </form>
    </Layout>
  );
}

ProfileScreen.auth = true;
