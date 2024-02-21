'use client'

import Link from 'next/link'
import Modal from '../Modal.js';
import HeaderLogo from './HeaderLogo.js';
import InscriptionForm from '../InscriptionForm.js';
import LoginPage from '../LoginPage.js';
import { useContext, useState } from "react";
import { UserContext } from "../UserContext.js";
import RequestPasswordReset from "../RequestPasswordReset.js";
import VerifyResetCode from "../VerifyResetCode.js";
import AccountActivationForm from '../AccountActivationForm.js';
import ConfirmationPage from '../ConfirmationPage.js';
import ResetPassword from '../ResetPassword.js';
import { useAuth } from '@/app/context/AuthContext.js';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  const [modal, setModal] = useState('Login');
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, accessToken, refreshToken, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLoginClick = () => {
    // Logique pour ouvrir le modal de connexion
  };

  const changeModal = (value) => {
    setModal(value);
  }

  const handlePostListingClick = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setModal('Login');
      setShowModal(true);
    } else {
      console.log(accessToken)
      console.log(refreshToken)
    }
  };

  function renderModalComponent(modal, changeModal) {
    switch (modal) {
      case 'Login':
        return (
          <Modal show={showModal}>
            <LoginPage title={'Login'} onClose={handleCloseModal} switchToRegister={() => changeModal('Register')} RequestRecoveryPage={() => changeModal('RequestPasswordReset')} />
          </Modal>
        );
      case 'RequestPasswordReset':
        return (
          <Modal show={showModal}>
            <RequestPasswordReset title={'Vérification du code du numéro'} onBack={() => changeModal('Login')} onValidate={() => changeModal('VerifyResetCode')} />
          </Modal>
        );
      case 'Register':
        return (
          <Modal show={showModal}>
            <InscriptionForm title={'S\'inscrire'} onClose={handleCloseModal} switchToLogin={() => changeModal('Login')} switchToAccountActivation={() => changeModal('AccountActivationForm')} />
          </Modal>
        );
      case 'AccountActivationForm':
        return (
          <Modal show={showModal}>
            <AccountActivationForm title={'Vérification du code'} onBack={() => changeModal('Register')} onValidate={() => changeModal('ConfirmationPage')} />
          </Modal>
        );
      case 'ConfirmationPage':
        return (
          <Modal show={showModal} >
            <ConfirmationPage onClick={() => changeModal('Login')} />
          </Modal>
        );
      case 'VerifyResetCode':
        return (
          <Modal show={showModal}>
            <VerifyResetCode title={'Vérification du code'} onBack={() => changeModal('RequestPasswordReset')} onValidate={() => changeModal('ResetPassword')} />
          </Modal>
        );
      case 'ResetPassword':
        return (
          <Modal show={showModal}>
            <ResetPassword title={'Vérification du code'} onBack={() => changeModal('RequestPasswordReset')} onValidate={() => changeModal('ConfirmationPage')} />
          </Modal>
        );
      default:
        return null;
    }
  }


  const handleOpenModal = () => {
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false);
    setModal('Login');
  }


  // const handleProfileSubmit = (data) => {
  //   if (!!user) {
  //     console.log('x')
  //   } else (!!user)
  //   {
  //     handleOpenModal
  //   }
  // }

  const { user } = useContext(UserContext);
  // const [user,setUser] = useState(null);
  return (
    <header
      className="grid grid-cols-3 justify-between fixed top-0 w-full bg-white shadow-md items-center px-10 py-4 z-10"
    >
      <HeaderLogo className="justify-start" />

      <div className="flex justify-center">
        <Link href="" className="flex border border-gray-300 rounded-full  items-center hover:shadow-xl py-2 px-2 shadow-md shadow-gray-300 cursor-pointer">
          <div className='px-2 '>
            Rechercher un logement specifique
          </div>
          <div className=" flex justify-center bg-rose-400 text-white p-1 rounded-full w-10 h-10 items-center">
            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134.62 134.62" className="w-6 h-6">
              <g id="Layer_1-2" data-name="Layer 1">
                <path fill="white" class="cls-1" d="M134.62,119.76l-42.62-42.62c12.54-19.37,10.34-45.52-6.64-62.49C65.83-4.88,34.17-4.88,14.64,14.64s-19.53,51.18,0,70.71c16.98,16.98,43.12,19.18,62.49,6.64l42.62,42.62,14.86-14.86ZM27.47,72.53c-12.44-12.44-12.44-32.62,0-45.06s32.62-12.44,45.06,0,12.44,32.62,0,45.06-32.62,12.44-45.06,0Z" />
              </g>
            </svg>
          </div>
        </Link>
      </div>
      <div className='flex justify-end'>
        <button href="" onClick={handlePostListingClick} className='button-border flex py-2 px-4 rounded-lg mx-10 hover:shadow-lg'>Mettre mon logement sur Kubi</button>
        {/* <Link href="" onClick={handlePostListingClick} className='flex py-2 px-4 rounded-lg mx-10 hover:shadow-lg'>Mettre mon logement sur Kubi</Link> */}
        {/* <Link href="" onClick={handleOpenModal} className="flex items-center border hover:shadow-lg border-gray-300 rounded-full py-2 px-2 ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative top-1">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
          {!!user && (
            <div>
              {user.name}
            </div>
          )}
        </Link> */}
        <div className='flex justify-end'>
          {isAuthenticated ? (
            <div >
              <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className='button-border flex items-center border hover:shadow-lg border-gray-300 rounded-full py-2 px-2' onClick={toggleDropdown}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative top-1">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>


              {isDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                      <button className="button-style flex items-center px-4 py-2 m-5 text-2xl"><FaUser className="mr-2" />Profil</button>
                    </li>
                    <li>
                      <button className="button-style flex items-center px-4 py-2 m-5 text-2xl" onClick={logout}><FaSignOutAlt className="mr-2" />Déconnexion</button>
                    </li>
                  </ul>
                </div>
              )}</div>
              ) : (
              <button className='button-border flex items-center border hover:shadow-lg border-gray-300 rounded-full py-2 px-2' onClick={handleOpenModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative top-1">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
          )}
            </div>
      </div>

        {renderModalComponent(modal, changeModal)}
    </header>
  );
}