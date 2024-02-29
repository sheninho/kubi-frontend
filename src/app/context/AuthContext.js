'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
    });
    const router = useRouter()
    const [redirectUrl, setRedirectUrl] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (accessToken && refreshToken) {
            setAuthState({ accessToken, refreshToken, isAuthenticated: true });
        }
    }, []);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setAuthState({ accessToken, refreshToken, isAuthenticated: true });    
        if (redirectUrl) {
            router.push(redirectUrl);
            setRedirectUrl('');
          }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthState({ accessToken: null, refreshToken: null, isAuthenticated: false });
    };

    const prepareLogin = (url) => {
        setRedirectUrl(url);
        // Ici, ouvrez votre modal de connexion
      };

    // Ajoutez ici la logique pour rafraîchir le token si nécessaire

    return (
        <AuthContext.Provider value={{ ...authState, login, logout,prepareLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
