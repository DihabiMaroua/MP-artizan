import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getProductByIdApi } from '../../services/api';
import { useAuth } from '../../contexts/authContext';
import { MdRemoveShoppingCart } from 'react-icons/md'; 

function CartList() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('cartProducts');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('productId');

  const { state: { jwt } } = useAuth();

  const addProductToCart = (productDetails) => {
    setProducts(currentProducts => {
        const existingProduct = currentProducts.find(p => p.data.id === productDetails.data.id);
        if (existingProduct) {
          return currentProducts.map(p =>
            p.data.id === productDetails.data.id ? { ...p, quantity: p.quantity + 1 } : p
          );
        } else {
          return [...currentProducts, { ...productDetails, quantity: 1 }];
        }
    });
    const existingProduct = products.find(p => p.data.id === productDetails.data.id);
    if (existingProduct) {
      const updatedProducts = products.map(p =>
        p.data.id === productDetails.data.id ? { ...p, quantity: p.quantity + 1 } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
    } else {
      const newProducts = [...products, { ...productDetails, quantity: 1 }];
      setProducts(newProducts);
      localStorage.setItem('cartProducts', JSON.stringify(newProducts));
    }
  };

  const incrementQuantity = (productId) => {
    const updatedProducts = products.map(p =>
      p.data.id === productId ? { ...p, quantity: p.quantity + 1 } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
  };
  
  const decrementQuantity = (productId) => {
    const updatedProducts = products.map(p => {
      if (p.data.id === productId) {
        return { ...p, quantity: Math.max(1, p.quantity - 1) }; 
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
  };

  const  removeProductFromCart = (productId) => {
    const updatedProducts = products.filter(p => p.data.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
  };

  const getTotalPrice = () => {
    return products.reduce((acc, product) => acc + (product.data.attributes.price * product.quantity), 0);
  };
  
  useEffect(() => {
    if (productId && jwt) {
      const fetchProductDetails = async () => {
        try {
          const productDetails = await getProductByIdApi(productId, jwt);
          addProductToCart(productDetails);
        } catch (error) {
          console.error("Erreur lors de la récupération des détails du produit :", error);
        }
      };
  
      fetchProductDetails();
    }
  }, [productId, jwt]);
  


  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg mx-4">
          <MdRemoveShoppingCart className="h-12 w-12 mx-auto text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-800">Panier Vide</h1>
          <p className="text-md text-gray-600 mt-2">Votre panier est actuellement vide. Commencez à faire vos achats pour ajouter des articles à votre panier.</p>
        </div>
      </div>
    );
  }
  

 return (
    <div className="flex flex-col w-full">
    <h2 className="text-2xl font-bold text-center my-4">Panier</h2>
    {products.map(product => (
      <div key={product.data.id} className="flex w-full items-center p-4 border-b border-gray-300">
        <img
          className="w-20 h-20 object-cover mr-4"
          src={process.env.REACT_APP_IMAGES_URL + product.data.attributes.picture.data[0].attributes.url}
        />
        <div className="flex flex-col flex-grow">
          <h3 className="text-lg font-semibold">{product.data.attributes.name}</h3>
          <p className="text-sm text-gray-600">{product.data.attributes.description}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-bold">{product.data.attributes.price} €</p>
            <div className="flex items-center">
              <button onClick={() => decrementQuantity(product.data.id)} className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300">-</button>
              <span className="px-4">{product.quantity}</span>
              <button onClick={() => incrementQuantity(product.data.id)} className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300">+</button>
            </div>
            <button onClick={() => removeProductFromCart(product.data.id)} className="px-4 py-2 text-xs text-white bg-danger rounded">Supprimer</button>
          </div>
        </div>
      </div>
    ))}
    <div className="my-4 mx-auto text-center">
      <p className="text-xl font-semibold">Total : {getTotalPrice()} €</p>
      <button onClick={() => console.log('Proceed to checkout')} color="primary" className="mt-4 px-6 py-2 text-white bg-black rounded">Passer la commande</button>
    </div>
  </div>
);
}

export default CartList;
