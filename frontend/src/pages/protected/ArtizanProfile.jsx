import React from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import Artizan from '../../components/profile/Artizan';

function ArtizanProfile() {
  return (
    <div className="flex min-h-screen">
      <div className="bg-gray-950">
        <Dashboard />
      </div>
      <div className="flex-grow p-5 bg-gray-100"> 
        <Artizan />
      </div>
    </div>
  );
}

export default ArtizanProfile;
