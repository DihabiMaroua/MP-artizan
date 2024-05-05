import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/forms/RegisterForm'
import LoginForm from '../components/forms/LoginForm'
import { useAuth } from '../contexts/authContext'

function Auth () {
  const [isRegister, setIsRegister] = useState(false)
  const navigate = useNavigate()

  const { state: { jwt, user } } = useAuth()

  useEffect(() => {
    if (jwt && user) {
      navigate('/dashboard')
    }
  }, [])

  return (
    <div className='flex flex-col justify-center items-center gap-4  py-10 px-8 w-full h-[700px]'>
      {
        isRegister
          ? <RegisterForm />
          : <LoginForm />
      }
      <a onClick={() => setIsRegister(!isRegister)} style={{ cursor: 'pointer' }}>
        {isRegister ? "J'ai déjà un compte" : "Je n'ai pas de compte"}
      </a>
    </div>
  )
}

export default Auth
