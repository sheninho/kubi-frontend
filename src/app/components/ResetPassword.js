import React, { useRef, useState } from 'react';
import Link from 'next/link';
import axios from "axios";
import { API_URL } from '../services/authService';

import PhoneInput from './PhoneInput';
import CircularProgress from '@mui/material/CircularProgress';
import { IoMdArrowBack } from 'react-icons/io'; // Ionicons



export function ResetPassword({ switchToLogin, onValidate, title, onBack }) {
  const [password, setPassword] = useState('');
  const [re_password, setRePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const phoneNumber = sessionStorage.getItem('phoneNumber');

  function isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers
    );
  }

  async function registerUser(ev) {
    ev.preventDefault();
    if (!isPasswordStrong(password)) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule.');
      return;
    }

    if (password !== re_password) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    setErrorMessage('');
    console.log(phoneNumber)
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}change-password/`, {
        phone_number: phoneNumber, 
        password: password
      });
      onValidate()
    } catch (e) {
      console.log(e);
      if (e.response && e.response.data.error) {
        setErrorMessage(e.response.data.error);
      } else {
        setErrorMessage('Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.');
      }
    }

    setIsLoading(false);
  }

  return (<>

    <div className="">
      <button className='button-style' disabled={isLoading} onClick={onBack}  >
        <IoMdArrowBack className="close-button" size={25} />
      </button>
      <h1 className="text-4xl text-center mb-4">{title}</h1>
    </div>
    <form className="max-w-md mx-auto" onSubmit={registerUser}>
      <input
        disabled={isLoading}
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={ev => setPassword(ev.target.value)} />
      <input
        disabled={isLoading}
        type="password"
        placeholder="Confirmer le mot de passe"
        value={re_password}
        onChange={ev => setRePassword(ev.target.value)} />
      {errorMessage && <div className="text-center" style={{ color: 'red' }}>{errorMessage}</div>}
      <button disabled={isLoading} className="primary">{isLoading ? <CircularProgress /> : "Changer le mot de passe"}</button>
      <div className="text-center py-2 text-gray-500">
        J'ai déja un compte. <button disabled={isLoading} onClick={() => switchToLogin()} className="underline text-black button-style">Se connecter</button>
      </div>
    </form></>
  );
}


export default ResetPassword;