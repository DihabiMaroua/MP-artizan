import { useAuth } from '../../contexts/authContext'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardHeader, Button } from '@nextui-org/react';
import PropTypes from 'prop-types';
import ArtisanAvatar from '../ArtisanAvatar';
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuPencil} from "react-icons/lu";
import { toast } from 'react-toastify'
import { AiOutlineShopping } from 'react-icons/ai';

function ProductsListItem ({ product }) {
  const { deleteProduct } = useAuth();
  const navigate = useNavigate();
  const { state: { user, jwt } } = useAuth();
  const location = useLocation();
  const { name, description, price, picture, artisan } = product.attributes
  const imgUrl = picture && picture.data && picture.data.length > 0
  ? process.env.REACT_APP_IMAGES_URL + picture.data[0].attributes.url
  : 'URL_d_une_image_par_defaut';
  const showArtisan = artisan && artisan.data && artisan.data.attributes && artisan?.data?.attributes?.profilePicture

  const isOnProductsPage = location.pathname === '/products';
  const showButtons = user && isOnProductsPage;

  const handleEdit = () => {
    navigate(`${product.id}/update`); 
  };
  

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(product.id, jwt);
        toast.success("Produit supprimé avec succès");
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error);
        toast.error("Erreur lors de la suppression du produit");
      }
    }
  };

  const handleCartClick = () => {
    navigate(`/cart?productId=${product.id}`);
  };
  return (
    <Card className='max-w-[400px] min-h-[600px] flex flex-col flex-grow'>
      <CardHeader className='p-0'>
        <img
          src={imgUrl}
        />
      </CardHeader>
      <CardBody className='flex flex-col gap-4 justify-between'>
        <h3 className='font-semibold text-xl'>{name}</h3>
        <p>{description}</p>
      </CardBody>
      <CardFooter className='flex flex-row justify-between '>
        {
          showArtisan && <ArtisanAvatar artisan={artisan} />
        }
        <p className="text-xl font-semibold" style={{ whiteSpace: 'nowrap', marginRight: '20px' }}>{price} €</p>
        <a  onClick={handleCartClick} className="cursor-pointer">
          <AiOutlineShopping size={24} />
        </a>
        {showButtons && (
          <div className="flex justify-end gap-2">
            <Button color="primary" size="small"  onClick={handleEdit}>Modifier <LuPencil/></Button>
            <Button size="small" color="danger" onClick={handleDelete}> Supprimer <RiDeleteBin5Line/></Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

ProductsListItem.propTypes = {
  product: PropTypes.object.isRequired
}

export default ProductsListItem
