import { useEffect, useState } from 'react';
import { validateRegisterForm } from '../../services/formAuthValidation';
import { Button, Input, Checkbox } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

function RegisterForm() {
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    password: null,
    businessName: null,
    businessDescription: null
  });

  const [userInfos, setUserInfos] = useState({
    firstName: 'test',
    lastName: 'test',
    username: 'test',
    email: 'test@test.com',
    password: '123456'
  });

  const [isArtisan, setIsArtisan] = useState(false);

  const navigate = useNavigate();
  const { state: { user, jwt, loading, error }, register } = useAuth();

  useEffect(() => {
    if (user && jwt) {
      navigate('/profil');
    }
  }, [user, jwt]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'businessPhoto') {
      setUserInfos(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setUserInfos(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (event) => {
    setIsArtisan(event.target.checked);
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    const userErrors = validateRegisterForm(userInfos);
    let artisanErrors = {};
    let artisanData = {};
  
    if (isArtisan) {
      artisanData = {
        name: userInfos.businessName,
        description: userInfos.businessDescription,
        profilePicture: userInfos.businessPhoto
      };
    }
  
    if (Object.keys(userErrors).length === 0 && Object.keys(artisanErrors).length === 0) {
      register(userInfos, isArtisan ? artisanData : null);
    } else {
      setErrors({ ...userErrors, ...artisanErrors });
    }
  };
  



  return (
    <form className='form-container flex flex-col gap-4 w-1/2' onSubmit={handleSubmit}>
      <h2 className='text text-xl'>S'INSCRIRE</h2>
      <Input
        name='lastName'
        label='Nom : '
        placeholder='Entrez votre nom...'
        value={userInfos.lastName}
        onChange={handleChange}
        error={errors.lastName}
      />
      <Input
        name='firstName'
        label='Prénom : '
        placeholder='Entrez votre prénom...'
        value={userInfos.firstName}
        onChange={handleChange}
        error={errors.firstName}
      />
      <Input
        name='username'
        label="Nom d'utilisateur : "
        placeholder="Entrez votre nom d'utilisateur..."
        value={userInfos.username}
        onChange={handleChange}
      />
      <Input
        name='email'
        label='Email : '
        placeholder='Entrez votre adresse email...'
        value={userInfos.email}
        onChange={handleChange}
      />
      <Input
        name='password'
        label='Mot de passe : '
        placeholder='Entrez un mot de passe...'
        value={userInfos.password}
        onChange={handleChange}
      />
      <Checkbox checked={isArtisan} onChange={handleCheckboxChange}>
        S'enregistrer comme artisan
      </Checkbox>
      {isArtisan && (
        <>
          <Input
            name='businessName'
            label='Nom de l’artisan : '
            placeholder='Entrez votre nom artisan complet...'
            value={userInfos.businessName || ''}
            onChange={handleChange}
            error={errors.businessName}
          />
          <Input
            name='businessDescription'
            label='Description : '
            placeholder='Décrivez votre activité...'
            value={userInfos.businessDescription || ''}
            onChange={handleChange}
            error={errors.businessDescription}
          />
          <input
            className="mt-4 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100"
            type='file'
            name='businessPhoto'
            onChange={handleChange}
            error={errors.businessPhoto}
          />
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Button isLoading={loading} type='submit' color='primary'>
        S'enregistrer
      </Button>
    </form>
  );
}

export default RegisterForm;
