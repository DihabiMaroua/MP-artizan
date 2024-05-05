import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { AiOutlineUser, AiOutlineMail, AiOutlineInfoCircle} from "react-icons/ai";
import { Button } from '@nextui-org/react';
import { LuPencil } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from 'react-toastify';

const Settings = () => {
  const { state, updateUser, deleteAccount } = useAuth(); 
  const { jwt, user } = state;

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = { firstName, lastName, email, username };
    updateUser(userData, jwt, user.id);
  };

  
  const handleDeleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
      try {
        await deleteAccount(user.id, jwt);
        toast.success( `${user.firstName}` + ", votre compte a été supprimé avec succès.");
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Une erreur inattendue s'est produite lors de la tentative de suppression du compte.";
        toast.error("Erreur : " + errorMessage);      }
    }
  };
  
  return (
<div className="max-w-4xl mx-auto my-10 bg-white p-6 shadow-md rounded-lg">
    <h2 className="text-lg font-semibold border-b pb-4">Modifier vos informations personnelles</h2>
    <form onSubmit={handleSubmit} className="flex flex-wrap -mx-3 mt-4">
      <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          <AiOutlineUser className="inline-block text-lg mr-2" />Nom
        </label>
        <input 
          type="text" 
          className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
          placeholder='nouveau nom' 
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="w-full md:w-1/2 px-3">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          <AiOutlineUser className="inline-block text-lg mr-2" />Prénom
        </label>
        <input 
          type="text" 
          className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
          placeholder='nouveau prénom'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="w-full px-3 mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          <AiOutlineMail className="inline-block text-lg mr-2" />Email
        </label>
        <input 
          type="email" 
          className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
          placeholder='nouvelle adresse email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="w-full px-3 mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          <AiOutlineInfoCircle className="inline-block text-lg mr-2" />Identifiant
        </label>
        <input 
          type="text" 
          className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
          placeholder='nouveau identifiant' 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div> 
      <div className="w-full px-3 mt-4">
        <Button type="submit"  color="primary">
          Modifier <LuPencil />
        </Button>
      </div>
      <div className="w-full px-3 mt-4">
        <Button onClick={handleDeleteAccount} color="danger">
          Supprimer votre compte <RiDeleteBin5Line />
        </Button>
      </div>
    </form>
  </div>
  );
};

export default Settings;
