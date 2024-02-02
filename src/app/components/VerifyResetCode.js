import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VerificationInput from "react-verification-input";
import { API_URL } from '../services/authService';
import { AiOutlineClose } from 'react-icons/ai'
import { FaArrowLeft } from 'react-icons/fa'; // FontAwesome
import { MdArrowBack } from 'react-icons/md'; // Material Icons
import { IoMdArrowBack } from 'react-icons/io'; // Ionicons
import CircularProgress from '@mui/material/CircularProgress';

const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60); // Arrondir les secondes à l'entier le plus proche
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VerifyResetCode = ({ onValidate, onBack, title }) => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const codeLength = 6;
    const [isLoading, setIsLoading] = useState(false);
    const [codeResent, setCodeResent] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const phoneNumber = sessionStorage.getItem('phoneNumber');

    useEffect(() => {
        const fetchTimeRemaining = async () => {
            try {
                const response = await axios.get(`${API_URL}time-remaining/?phone_number=${phoneNumber}`);
                setTimeRemaining(response.data.time_remaining);
                setIsButtonDisabled(response.data.time_remaining > 0);
            } catch (error) {
                console.error("Erreur lors de la récupération du temps restant", error);
            }
        };
        fetchTimeRemaining();
        if (codeResent) {
            setCodeResent(false);
        }
    }, [phoneNumber,codeResent]);

    useEffect(() => {
        let interval = null;
        if (timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(timeRemaining => timeRemaining - 1);
            }, 1000);
        } else{
            setIsButtonDisabled(false);
            clearInterval(interval);
            console.log(isButtonDisabled, timeRemaining)
        }

        return () => clearInterval(interval);
    }, [timeRemaining]);


    const handleResendCode = async (e) => {
        e.preventDefault();
        setIsButtonDisabled(true)
        try {
            const response = await axios.post(`${API_URL}resend-code/`, { phone_number: phoneNumber });
            setCodeResent(true);
            console.log(response.data.message);
            
            // Gérer la réponse - par exemple, afficher un message de succès
        } catch (error) {
            setMessage(error.response.data.error || "Erreur lors de la création du nouveau code", error);
            // Gérer l'erreur - par exemple, afficher un message d'erreur
        }
        setIsButtonDisabled(false)
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const phoneNumber = sessionStorage.getItem('phoneNumber');
            await axios.post(`${API_URL}verify-code/`, { code: code, phone_number: phoneNumber });
            onValidate();
        } catch (error) {
            console.log(error)
            setMessage(error.response.data.error || 'Une erreur est survenue lors de l\'activation');
            setCode('')
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
            <form className="max-w-md mx-auto">
                <VerificationInput
                    length={codeLength}
                    value={code}
                    onChange={setCode}
                    validChars="0-9"
                    autoFocus={true}
                    onFocus={() => setMessage('')}
                    classNames={{
                        container: "container",
                        character: "character rounded-md",
                        characterInactive: "character--inactive",
                        characterSelected: "character--selected",
                        characterFilled: "character--filled",
                    }}
                />

                {message && <div className="mt-5 text-center" style={{ color: 'red' }}>{message}</div>}

                <div className='mt-5 text-center'>
                    {isButtonDisabled ? (
                        <p>Vous pouvez demander un nouveau code dans<br /> {formatTime(timeRemaining)}</p>
                    ) : (
                        <button className='p-2 rounded-lg' onClick={handleResendCode}>Renvoyer le Code</button>
                    )}
                </div>
                <button className="primary mt-5" disabled={code.length !== codeLength} onClick={handleSubmit} >{isLoading ? <CircularProgress /> : "Confirmer"}</button>

            </form>
        </div>
    );
};

export default VerifyResetCode;
