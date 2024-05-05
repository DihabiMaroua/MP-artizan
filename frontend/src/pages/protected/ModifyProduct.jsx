import React from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import UpdateProduct from '../../components/products/UpdateProduct';

function ModifyProduct() {
  return (
    <div className="flex min-h-screen">
      <div className="bg-gray-950">
        <Dashboard />
      </div>
      <div className="flex-grow p-5 bg-gray-100"> 
        <UpdateProduct />
      </div>
    </div>
  );
}

export default ModifyProduct;
