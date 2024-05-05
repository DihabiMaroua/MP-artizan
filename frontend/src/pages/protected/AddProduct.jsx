import React from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import AddProduct from '../../components/products/AddProduct';

function NewProduct() {
  return (
    <div className="flex min-h-screen">
      <div className="bg-gray-950">
        <Dashboard />
      </div>
      <div className="flex-grow p-5 bg-gray-100"> 
        <AddProduct />
      </div>
    </div>
  );
}

export default NewProduct;
