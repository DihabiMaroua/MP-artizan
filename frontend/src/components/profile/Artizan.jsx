import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useFetch } from '../../hooks/Api';
import { AiFillFacebook, AiFillLinkedin, AiFillInstagram, AiOutlineTwitter, AiFillCamera } from 'react-icons/ai';
import { toast } from 'react-toastify';

const Artizan = () => {
  const [artisanInfo, setArtisanInfo] = useState(null);
  const [file, setFile] = useState(null);  
  const [preview, setPreview] = useState(null); 
  const { state: { jwt, user } } = useAuth();
  const { response: artisanResponse } = useFetch(`/artisans?filters[user][id][$eq]=${user.id}&populate=*`);

  useEffect(() => {
    if (artisanResponse && artisanResponse.length > 0) {
      const artisanData = artisanResponse[0];
      setArtisanInfo(artisanData);
    }
  }, [artisanResponse]);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        await uploadProfilePicture(selectedFile);
    } else {
        toast.error("Aucune image sélectionnée.");
    }
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };
  
  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('files', file);
    
    try {
      const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        const imageId = uploadResult[0].id;
        
        const updateResponse = await fetch(`${process.env.REACT_APP_API_URL}/artisans/${artisanInfo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ data: { profilePicture: imageId } }),
        });

        if (updateResponse.ok) {
          toast.success("Photo de profil mise à jour avec succès!");
          setArtisanInfo(prev => ({ ...prev, attributes: { ...prev.attributes, profilePicture: uploadResult[0] } }));
        } else {
          throw new Error('Failed to update artisan profile picture.');
        }
      } else {
        throw new Error('Failed to upload image.');
      }
    } catch (error) {
      console.error("Error updating artisan's profile picture:", error);
      toast.error("Erreur lors de la mise à jour de la photo de profil.");
    }
  };

  if (!artisanInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold border-b pb-4">Profil</h2>
      <div className="flex flex-col items-center justify-center my-6">
        <div className="mb-4">
          <div className="relative">
            <img
              className="w-24 h-24 rounded-full"
              src={preview || (artisanInfo.attributes.profilePicture ? process.env.REACT_APP_IMAGES_URL + artisanInfo.attributes.profilePicture.data.attributes.url : '')}
              alt="Profile"
            />
            <button
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2"
              style={{ transform: 'translate(10%, 10%)' }}
              onClick={triggerFileInput}
            >
              <AiFillCamera className="w-3 h-3" />
            </button>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">{artisanInfo.attributes.name}</h1>
          <p className="text-sm text-gray-600">Artisan</p>
        </div>
        <p className="my-6 text-gray-700 mb-4 text-center">{artisanInfo.attributes.description}</p>
      </div>
      <div className="flex flex-col items-center justify-center my-6">
        <p className="text-sm text-gray-600">Suivez-moi sur</p>
        <div className="flex space-x-4 items-center justify-center my-2">
          <a href="#"><AiFillFacebook className="text-xl" /></a>
          <a href="#"><AiOutlineTwitter className="text-xl" /></a>
          <a href="#"><AiFillInstagram className="text-xl" /></a>
          <a href="#"><AiFillLinkedin className="text-xl" /></a>
        </div>
      </div>
    </div>
  );
};

export default Artizan;
