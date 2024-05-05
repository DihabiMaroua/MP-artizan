import React from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import Settings from '../../components/profile/settings';

function Profil() {
  return (
    <div className="flex min-h-screen">
      <div className="bg-gray-950">
        <Dashboard />
      </div>
      <div className="flex-grow p-5 bg-gray-100"> 
        <Settings />
      </div>
    </div>
  );
}

export default Profil;
