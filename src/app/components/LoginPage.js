import { useAuth  } from '../context/AuthContext.js';
import { useContext, useState } from "react";
import axios from "axios";
import PhoneInput from './PhoneInput.js';
import { AiOutlineClose } from 'react-icons/ai';
import { API_URL } from '../services/authService';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoginPage({ switchToRegister, RequestRecoveryPage, onClose, title }) {
  const [phone_number, setPhone_number] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneLength, setPhoneLength] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    if (phone_number.length !== phoneLength) {
      console.log(phone_number.length)
      setErrorMessage(`Le numéro de téléphone doit contenir exactement ${phoneLength} chiffres.`);
      return;
    }
    setIsLoading(true);
    try {
        const response = await axios.post(`${API_URL}login/`, {
            username: phone_number,
            password: password
        });
        console.log(response)
        const { access, refresh } = response.data;
        login(access, refresh);
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        onClose();
        // Rediriger l'utilisateur ou effectuer une autre action après la connexion réussie
    } catch (error) {
      console.log(error)
        if (error.response) {
            // Gérer les erreurs renvoyées par le serveur
            setErrorMessage(error.response.data.detail || 'Erreur lors de la connexion.');
        } else {
            // Gérer les autres erreurs
            setErrorMessage('La connexion a échoué. Veuillez réessayer.');
        }
    }
    setIsLoading(false);
};

  return (<div>
    <div className="">
      <button  disabled={isLoading}   onClick={onClose} className='button-style' >
        <AiOutlineClose size={25} />
      </button>
      <h1 className="text-4xl text-center mb-4">{title}</h1>
    </div>
    <form className="max-w-md mx-auto" onSubmit={handleLogin}>
      <PhoneInput value={phone_number} 
      onChangePhone={setPhone_number} 
      onChangeCountrie={setPhoneLength}
      />
      <input type="password"
        placeholder="password"
        value={password}
        onChange={ev => setPassword(ev.target.value)} />
        
      {errorMessage && <div className="text-center" style={{ color: 'red' }}>{errorMessage}</div>}
      <button disabled={isLoading} className="primary">{isLoading ? <CircularProgress /> : "Connexion"}</button>
      <div className="text-center py-2 text-gray-500">
        Je n'ai pas encore de compte <button  disabled={isLoading}  onClick={() => switchToRegister()} className="underline text-black button-style">S'inscrire maintenant</button>
      </div>
      <div className="text-center py-2">
        <button disabled={isLoading}  onClick={() => RequestRecoveryPage()} className="underline text-black button-style">J'ai oublié mon mot de passe</button>
      </div>
    </form>

  </div>
  );
}