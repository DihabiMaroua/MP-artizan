import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useFetch } from '../../hooks/Api';
import ProductsList from '../../components/products/ProductsList';
import Dashboard from '../../components/dashboard/Dashboard';

function Products() {
  const { state: { user } } = useAuth();
  const [artisanSlug, setArtisanSlug] = useState('');
  const [products, setProducts] = useState(null);
  const [isProductsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  const { response: artisanResponse, loading: artisanLoading } = useFetch(
    `/artisans?filters[user][id][$eq]=${user.id}&populate=*`
  );

  useEffect(() => {  
    //console.log("Réponse de l'API pour l'artisan:", artisanResponse);  
    if (artisanResponse && artisanResponse.length > 0) {
        const artisanSlug = artisanResponse[0].attributes.slug;
        setArtisanSlug(artisanSlug);
        //console.log("Slug de l'artisan:", artisanSlug);
    }
  }, [artisanResponse]);
  
  useEffect(() => {
    if (artisanSlug) {
      const fetchProducts = async () => {
        setProductsLoading(true);
        try {
          const response = await fetch(`http://localhost:1337/api/products?filters[artisan][slug][$eq]=${artisanSlug}&populate=*`);
          console.log(response)
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          setProductsError(error);
        } finally {
          setProductsLoading(false);
        }
      };

      fetchProducts();
    }
  }, [artisanSlug]);

  //console.log(products?.data)
  if (artisanLoading || isProductsLoading) {
    return <h1>Chargement...</h1>;
  }

  if (productsError) {
    return <pre>{JSON.stringify(productsError, null, 2)}</pre>;
  }

  return (
    <div className="flex min-h-screen">
      <div className=" bg-gray-950">
        <Dashboard />
      </div>
      <div className="flex-grow p-5 bg-gray-100">
        {products?.data && products.data.length > 0 ? (
          <ProductsList products={products.data} />
        ) : (
          <p>Aucun produit trouvé</p>
        )}
      </div>
    </div>
  );
}

export default Products;
