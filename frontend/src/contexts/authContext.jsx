import { createContext, useContext, useEffect, useReducer } from 'react'
import { deleteAccountApi, deleteProductApi, loginApi, registerApi, updateProductApi, updateUserInfoApi } from '../services/api'
import { toast } from 'react-toastify'

const AuthContext = createContext()

const actionTypes = {
  USER_INFO_UPDATED: 'USER_INFO_UPDATED', //update un user ,
  LOGIN: 'LOGIN', // Connecté avec succès
  REGISTER: 'REGISTER', // Inscrit + connecté avec succès
  LOGOUT: 'LOGOUT', // Déconnecté
  DELETE_ACCOUNT: 'DELETE_ACCOUNT', // supprimer un compte
  DELETE_PRODUCT: 'DELETE_PRODUCT', // la suppression d'un produit
  LOADING: 'LOADING', // Chargement
  ERROR: 'ERROR', // Erreur
  RESET: 'RESET' // Réinitialisation de l'état
}

const initialState = {
  jwt: null,
  user: null,
  loading: false,
  isLoggedIn: false,
  error: null
}

/**
 * @param prevState Etat précédent l'action
 * @param action Action pour mettre à jour l'état = { type, data? = { jwt, user, error } }
 */
const authReducer = (prevState, action) => {
  switch (action.type) {
    case actionTypes.REGISTER:
      return {
        jwt: action.data.jwt,
        user: action.data.user,
        isLoggedIn: true,
        loading: false,
        error: null
      }
    case actionTypes.USER_INFO_UPDATED:
      return {
        ...prevState,
        user: action.payload,
        error: null,
      }
    case actionTypes.DELETE_ACCOUNT:
      return {
        ...prevState,
        loading: false,
      }     
    case actionTypes.ACCOUNT_DELETED_SUCCESSFULLY:
        return initialState;   
    case actionTypes.DELETE_PRODUCT:
      return {
        ...prevState,
        jwt: null,  
        user: null,
        isLoggedIn: false,
        loading: false,
      }     
    case actionTypes.LOGIN:
      return {
        jwt: action.data.jwt,
        user: action.data.user,
        isLoggedIn: true,
        loading: false,
        error: null
      }
    case actionTypes.ERROR:
      return {
        jwt: null,
        user: null,
        loading: false,
        isLoggedIn: false,
        error: action.data.error
      }
    case actionTypes.LOADING:
      return {
        ...prevState, 
        loading: true
      }
    case actionTypes.RESET:
    case actionTypes.LOGOUT:
      return initialState
    default:
      throw new Error(`Unhandled action type : ${action.type}`)
  }
}

const authFactory = (dispatch) => ({
  login: async (credentials) => {
    dispatch({ type: actionTypes.LOADING })
    try {
      const result = await loginApi(credentials)
      dispatch({
        type: actionTypes.LOGIN,
        data: {
          user: result.user,
          jwt: result.jwt
        }
      })
    } catch (error) {
      console.error(error)
      toast.error('Identfiant ou mot de passe incorrect')
      dispatch({
        type: actionTypes.ERROR,
        data: {
          error: 'Identifiant ou mot de passe incorrect'
        }
      })
    }
  },
  logout: () => {
    dispatch({ type: actionTypes.LOGOUT })
  },
  register: async (userInfos, artisanInfos) => {
    dispatch({ type: actionTypes.LOADING });
    try {
      const result = await registerApi(userInfos, artisanInfos); // Pass artisanInfos as well
      if (result.user && result.jwt) {
        dispatch({
          type: actionTypes.REGISTER,
          data: {
            user: result.user,
            jwt: result.jwt
          }
        });
      } else {
        throw new Error('Registration incomplete: Missing user or JWT data.');
      }
    } catch (error) {
      console.error(error); 
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la suppression du compte";
      toast.error("Erreur : " + errorMessage);
      dispatch({
        type: actionTypes.ERROR,
        data: { error: errorMessage }
      });
    }
  },  
  updateUser: async (userData, jwt, userId) => {
    try {
      const updatedUser = await updateUserInfoApi(userData, jwt, userId);
      dispatch({
        type: actionTypes.USER_INFO_UPDATED,
        payload: updatedUser,
      });
      toast.success("Informations mises à jour avec succès.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour des informations.");
    }
  },
  deleteAccount: async (userId, jwt) => {
    dispatch({ type: actionTypes.LOADING });
    try {
      await deleteAccountApi(userId, jwt);
      dispatch({ type: actionTypes.ACCOUNT_DELETED_SUCCESSFULLY });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la suppression du compte";
      toast.error("Erreur : " + errorMessage);
      dispatch({
        type: actionTypes.ERROR,
        data: { error: errorMessage }
      });
    }
  },  
  deleteProduct: async (productId, jwt) => {
    dispatch({ type: actionTypes.LOADING });
    try {
      await deleteProductApi(productId, jwt);
      dispatch({
        type: actionTypes.DELETE_PRODUCT,
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.error?.message || "Erreur lors de la suppression du produit";
      toast.error(errorMessage);
      dispatch({
        type: actionTypes.ERROR,
        data: {
          error: errorMessage
        }
      });
    }
  },  
})

const AuthProvider = ({ children }) => {
  const savedState = window.localStorage.getItem('AUTH')
  const _initialState = savedState ? JSON.parse(savedState) : initialState
  const [state, dispatch] = useReducer(authReducer, _initialState)

  useEffect(() => {
    window.localStorage.setItem('AUTH', JSON.stringify(state))
  }, [state])

  return (
    <AuthContext.Provider value={{ state, ...authFactory(dispatch) }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an <AuthProvider>')
  return context
}

export {
  AuthProvider,
  useAuth
}
