import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineInfoCircle } from "react-icons/ai";

const DetailsProfile = () => {

  const { state: { user } } = useAuth();

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold border-b pb-4">Information personnelles</h2>
      <div className="flex flex-wrap -mx-3 mt-4">
        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            <AiOutlineUser className="inline-block text-lg mr-2" /> Nom
          </label>
          <input className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none" 
          type="text" 
          value={user.lastName} 
          readOnly 
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            <AiOutlineUser className="inline-block text-lg mr-2" /> Prénom
          </label>
          <input className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none" 
          type="text" 
          value={user.firstName} 
          readOnly 
          />
        </div>
      </div>
      <div className="mt-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            <AiOutlineMail className="inline-block text-lg mr-2" /> Email
          </label>
          <input className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none" 
          type="email" 
          value={user.email} 
          readOnly 
          />
      </div>
      <div className="mt-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            <AiOutlineInfoCircle className="inline-block text-lg mr-2" /> Identifiant
          </label>
          <input className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none" 
          type="text" 
          value={user.username} 
          readOnly 
          />
      </div>
    </div>
  );
};

export default DetailsProfile;
