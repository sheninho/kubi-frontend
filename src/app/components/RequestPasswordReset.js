import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services/authService';
import { IoMdArrowBack } from 'react-icons/io'; // Ionicons
import CircularProgress from '@mui/material/CircularProgress';
import PhoneInput from './PhoneInput';

const RequestPasswordReset = ({ title, onBack, onValidate }) => {
    const [phone_number, setPhone_number] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [phoneLength, setPhoneLength] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phone_number.length !== phoneLength) {
            console.log(phone_number.length)
            setMessage(`Le numéro de téléphone doit contenir exactement ${phoneLength} chiffres.`);
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}resend-code/`, { phone_number: phone_number });
            sessionStorage.setItem('phoneNumber', phone_number);
            onValidate();
            // Rediriger vers la page de vérification du code
        } catch (error) {
            setMessage(error.response.data.error || 'Erreur lors de la demande de réinitialisation du mot de passe.');
            // console.log(error.response.data.error)
        }
        setIsLoading(false);
    };

    return (
        <div>
            <div className="">
                <button className="button-style" disabled={isLoading} onClick={onBack} >
                    <IoMdArrowBack size={25} />
                </button>
                <h1 className="text-4xl text-center mb-4">{title}</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <PhoneInput
                    disabled={isLoading}
                    value={phone_number}
                    onChangePhone={setPhone_number}
                    onChangeCountrie={setPhoneLength}
                />
                <div className='mt-5 text-center'>
                    {message && <p >{message}</p>}
                </div>
                <button disabled={isLoading} className="primary mt-5" type="submit">{isLoading ? <CircularProgress /> : "Réinitialisation"}</button>
            </form>
        </div>
    );
};

export default RequestPasswordReset;
