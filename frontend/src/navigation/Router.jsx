import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'

/* Pages */
import About from '../pages/About'
import Contact from '../pages/Contact'
import Services from '../pages/Services'
import Artisans from '../pages/Artisans'
import Home from '../pages/Home'
import Profil from '../pages/protected/Profil'
import Settings from '../pages/protected/Settings'
import AddProduct from '../pages/protected/AddProduct'
import Artisan from '../pages/Artisan'
import Auth from '../pages/Auth'
import Dashboard from '../pages/protected/Dashboard'
import PrivateRoute from './PrivateRouteMiddleware'
import Products from '../pages/protected/ProductList' 
import ModifyProduct from '../pages/protected/ModifyProduct' 
import Cart from '../pages/protected/Cart' 
import ArtizanProfile from '../pages/protected/ArtizanProfile'

function Router () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='artisans'>
          <Route index element={<Artisans />} /> {/* Route <domaine>/artisans */}
          <Route path=':artisanSlug' element={<Artisan />} /> {/* Route <domaine>/artisans/<ID> */}
        </Route>
        <Route path='about' element={<About />} />
        <Route path='services' element={<Services />} />
        <Route path='contact' element={<Contact />} />
        <Route path='authentication' element={<Auth />} />
        <Route path='profil' element={<PrivateRoute />}>
          <Route index element={<Profil/>} />
        </Route>
        <Route path='artizan' element={<PrivateRoute />}>
          <Route index element={<ArtizanProfile/>} />
        </Route>
        <Route path='settings' element={<PrivateRoute />}>
          <Route index element={< Settings/>} />
        </Route>
        <Route path='product/add' element={<PrivateRoute />}>
          <Route index element={< AddProduct/>} />
        </Route>
        <Route path='products' element={<PrivateRoute />}>
          <Route index element={< Products/>} />
        </Route>
        <Route path='products/:productId/update' element={<PrivateRoute />}>
          <Route index element={<ModifyProduct />} />
        </Route>
        <Route path='cart' element={<PrivateRoute />}>
          <Route index element={< Cart/>} />
        </Route>
        <Route path='dashboard' element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
