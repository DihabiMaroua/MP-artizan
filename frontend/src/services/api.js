import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

/**
 * Call API Login route
 * @param {object} credentials { identifier, password }
 * @return {object} { jwt, user }
 */

const loginApi = async (credentials) => {
  const response = await axiosInstance.post('/auth/local', credentials)
  return response?.data
}


const registerApi = async (formData, artisanData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  const userData = new FormData();
  for (const key in formData) {
    userData.append(key, formData[key]);
  }

  const userResponse = await axiosInstance.post('/auth/local/register', userData, config);

  if (artisanData && userResponse?.data?.user?.id) {
    const artisanFormData = new FormData();
    artisanFormData.append('data', JSON.stringify({
      name: artisanData.name,
      description: artisanData.description,
      user: userResponse.data.user.id
    }));

    if (artisanData.profilePicture) {
      artisanFormData.append('files.profilePicture', artisanData.profilePicture, artisanData.profilePicture.name);
    }

    const artisanConfig = {
      headers: {
        'Authorization': `Bearer ${userResponse.data.jwt}`,
        'Content-Type': 'multipart/form-data'
      }
    };
    await axiosInstance.post('/artisans', artisanFormData, artisanConfig);
  }

  return userResponse?.data;
};




const updateUserInfoApi = async (userData, jwt, userId) => {
  const response = await axiosInstance.put(`/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });
  return response?.data;
}

const addProductApi = async (productData, jwt) => {
  const response = await axiosInstance.post('/products', productData, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });
  return response?.data;
};

const getProductByIdApi = async (productId, jwt) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}?populate=*`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    throw error;
  }
};

const updateProductApi = async (formData, jwt, productId) => {
  const response = await axiosInstance.put(`/products/${productId}`, formData, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });
  return response?.data;
};

const deleteProductApi = async (productId, jwt) => {
    const response = await axiosInstance.delete(`/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });
    return response?.data;
};

const deleteAccountApi = async (userId, jwt) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${jwt}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { deleteAccountApi, deleteProductApi, getProductByIdApi, loginApi, registerApi, updateUserInfoApi, addProductApi, updateProductApi };