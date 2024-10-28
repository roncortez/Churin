import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebaseConfig'; // Importa la configuración de Firebase
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [cliente, setCliente] = useState(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user);
            if (user) {
                const email = user.email;
                try {
                    const respuesta = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getUser`, {
                        email: email
                    });
                    setCliente(respuesta.data);
                } catch (error) {
                    console.error('Error al obtener cliente: ', error);
                }
            }
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        try {
            await auth.signOut();
            setCurrentUser(null);
            setCliente(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, cliente, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
