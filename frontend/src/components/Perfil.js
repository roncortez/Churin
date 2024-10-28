import React, { useEffect } from "react";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";


const Perfil = () => {

    const { usuarioActual } = useAuth();


    useEffect(() => {
        const fetchPedidos = async () => {
            const respuesta = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedidos/cliente/${idCliente}`, 
            )
        }
        
        fetchPedidos();

    }, [])

    return (
        <div>
            <h2>Mis pedidos</h2>
            
        </div>
    );
}

export default Perfil;


