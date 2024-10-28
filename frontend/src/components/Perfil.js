import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import '../styles/Perfil.css'

const Perfil = () => {

    const { cliente } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [detallePedidos, setDetallePedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleClick = async (idPedido) => {
        alert('Diste click en el pedido');
        try {
            const respuesta = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido/detalles-pedido/${idPedido}`)
            setDetallePedidos(respuesta.data);
        } catch (error) {
            console.error('Error al obtener los detalles: ', error);
        }
    }

    useEffect(() => {
        const fetchPedidos = async () => {
            if (cliente) {
                try {
                    const respuesta = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido/cliente/${cliente.id}`)
                    const pedidosOrdenados = respuesta.data.sort((a,b) => {
                        return new Date(b.fecha) - new Date(a.fecha);
                    })
                    setPedidos(pedidosOrdenados);
                } catch (error) {
                    console.error('Error al obtener los pedidos: ', error);
                    setError('No se pudieron cargar los pedidos');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // Si no hay cliente, terminamos la carga
            }
        }
        fetchPedidos();

    }, [cliente]);
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;



    return (
        <div className='perfil-container'>
            <h2>{cliente ? `${cliente.first_name} ${cliente.last_name}` : 'Cargando...'}</h2>
            <h2>Mis pedidos</h2>
            <div className='grid-container'>
                <div className='grid-header'>Fecha</div>
                <div className='grid-header'>Hora</div>
                <div className='grid-header'>Total</div>
                <div className='grid-header'>Entrega/Retiro</div>
                {pedidos.map(pedido =>
                    <div 
                        key={pedido.id} 
                        className='grid-row' 
                        onClick={() => handleClick(pedido.id)}
                    >
                        <div className='grid-item'>{pedido.fecha}</div>
                        <div className='grid-item'>{pedido.hora} </div>
                        <div className='grid-item'>{pedido.total}</div>
                        <div className='grid-item'>{pedido.lugar_envio}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Perfil;


