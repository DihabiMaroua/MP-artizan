import React from 'react';
import { FaRegUser, FaPlus, FaTools } from 'react-icons/fa';
import { Link as NextLink } from '@nextui-org/react';
import { AiOutlineSetting, AiOutlineUnorderedList } from 'react-icons/ai';

const Dashboard = () => {
  return (
    <>
    <div className="h-screen bg-gray-950 text-white p-5 z-20 relative overflow-y-auto">
      <h1 className="text-xl font-bold mb-2">COMPTE</h1>
      <nav className="flex flex-col">
        <NextLink href="/profil" className="flex items-center gap-2 p-3 text-white rounded-md hover:bg-primary transition duration-200">
          <FaRegUser className="text-lg" /> PROFIL
        </NextLink>
      </nav>
      <nav className="flex flex-col">
        <NextLink href="/artizan" className="flex items-center gap-2 p-3 text-white rounded-md hover:bg-primary transition duration-200">
          <FaTools className="text-lg" /> ARTISAN
        </NextLink>
      </nav>
      <nav className="flex flex-col">
        <NextLink href="/settings" className="flex items-center gap-2 p-3 text-white rounded-md hover:bg-primary transition duration-200">
        <AiOutlineSetting className="text-lg" /> PARAMÈTRES
        </NextLink>
      </nav>
      <h1 className="text-xl font-bold mt-4 mb-2"> PRODUIT</h1>
      <nav className="flex flex-col">
        <NextLink href="/product/add" className="flex items-center gap-2 p-3 text-white rounded-md hover:bg-primary transition duration-200">
          <FaPlus className="text-lg" /> NOUVEAU
        </NextLink>
      </nav>
      <nav className="flex flex-col">
        <NextLink href="/products" className="flex items-center gap-2 p-3 text-white rounded-md hover:bg-primary transition duration-200">
        <AiOutlineUnorderedList className="text-lg" /> PRODUITS
        </NextLink>
      </nav>
    </div>
    </> 
  );
};

export default Dashboard;
