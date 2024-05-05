import React, { useEffect, useState } from 'react';
import { AiOutlineShopping } from "react-icons/ai";
import { AiOutlineInfoCircle, AiOutlineDollarCircle, AiOutlinePicture } from "react-icons/ai";
import { Button } from '@nextui-org/react';
import { LuPencil } from "react-icons/lu";
import { useAuth } from '../../contexts/authContext'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getProductByIdApi } from '../../services/api';
import { useFetch } from '../../hooks/Api';
import { useNavigate } from 'react-router-dom';

const UpdateProduct = () => {
  const { productId } = useParams();
  const { state } = useLocation();
  const { state: { jwt, user } } = useAuth();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const [artisanInfo, setArtisanInfo] = useState('');
  const navigate = useNavigate();
  const { response: artisanResponse, loading: artisanLoading } = useFetch(
    `/artisans?filters[user][id][$eq]=${user.id}&populate=*`
  );
  
  useEffect(() => {
    if (artisanResponse && artisanResponse.length > 0) {
      const artisanInfo = artisanResponse[0]; 
      setArtisanInfo(artisanInfo);
    }
  }, [artisanResponse]);

  useEffect(() => {
    if (state?.product) {
      const { product } = state;
      setProductName(product.name);
      setProductDescription(product.description);
      setProductPrice(product.price);
    } else if (productId) {
      const fetchProduct = async () => {
        try {
          const productData = await getProductByIdApi(productId, jwt);
          console.log(productData)
          setProductName(productData.data.attributes.name);
          setProductDescription(productData.data.attributes.description);
          setProductPrice(productData.data.attributes.price);
          setProductImage(productData.data.attributes.picture.data[0].attributes.url);
        } catch (error) {
          toast.error("Erreur lors de la récupération des informations du produit");
          console.error(error);
        }
      };
      fetchProduct();
    }
  
  }, [productId, state, jwt]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const priceValue = parseFloat(productPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
    toast.error('Le prix du produit doit être supérieur à 0.');
    return;
    }
    try {
      let imageId = null;
      if (productImage instanceof File) {
        const formData = new FormData();
        formData.append('files', productImage);  
        const uploadResponse = await fetch( `${process.env.REACT_APP_API_URL}/upload`, { 
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        });
  
        if (!uploadResponse.ok) {
          throw new Error('Échec du téléchargement de l’image');
        }
        const uploadResult = await uploadResponse.json();
        imageId = uploadResult[0].id;
      }
  
      const productUpdateData = {
        name: productName,
        description: productDescription,
        price: productPrice,
      };
  
      if (imageId !== null) {
        productUpdateData.picture = imageId; 
      }
  
      const response = await fetch(`http://localhost:1337/api/products/${productId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ data: productUpdateData }), 
      });
  
      if (!response.ok) {
        throw new Error('Échec de la mise à jour des informations du produit');
      }else{
        toast.success("Produit mis à jour avec succès!");
        navigate('/products');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
      toast.error("Erreur lors de la mise à jour du produit.");
    }
  };
  
   

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold border-b pb-4">Modifier votre produit</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap -mx-3 mt-4">
        <div className="w-full px-3 mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <AiOutlineShopping className="inline-block text-lg mr-2" /> Nom
          </label>
          <input 
            type="text" 
            className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
            placeholder='Nom du produit' 
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="w-full px-3 mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <AiOutlineInfoCircle className="inline-block text-lg mr-2" /> Description
          </label>
          <textarea 
            className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
            placeholder='Description du produit' 
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </div>
        <div className="w-full px-3 mb-4 md:w-1/2 md:pr-2">
          <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <AiOutlineDollarCircle className="inline-block text-lg mr-2" /> Prix
          </label>
          <input 
            type="number" 
            className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none"
            placeholder='Prix du produit' 
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>
        <div className="w-full px-3 mb-4 md:w-1/2 md:pl-2">
          <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <AiOutlinePicture className="inline-block text-lg mr-2" /> Photo du produit
          </label>
          <input
            type="file"
            className="mt-4 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100"
            onChange={(e) => setProductImage(e.target.files[0])}
          />
        </div>
        <div className="w-full px-3 mt-4">
          <Button type="submit" auto flat color="primary">
            Modifier <LuPencil />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
