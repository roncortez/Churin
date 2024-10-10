import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Pedidos.css'

function Pedidos() {

    const [pedidosAgrupados, setPedidosAgrupados] = useState([]);
    const [detallesPedidos, setDetallesPedidos] = useState({}); // Objeto para almacenar detalles de cada pedido
    const [visibilidadDetalles, setVisibilidadDetalles] = useState({}); // Estado para controlar visibilidad

    const handleDetallesClick = async (pedidoId) => {
        const detallePedido = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido/detalle-pedido/${pedidoId}`);
        setDetallesPedidos(prev => (
            {
                ...prev,
                [pedidoId]: detallePedido.data
            }
        ));

        setVisibilidadDetalles(prev => ({
            ...prev,
            [pedidoId]: !prev[pedidoId]
        }));
    }

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const responsePedidos = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pedido`);
                const pedidos = responsePedidos.data;

                const pedidosAgrupados = [...pedidos].reduce((acc, pedido) => {
                    const fecha = pedido.fecha;
                    if (!acc[fecha]) {
                        acc[fecha] = [];
                    };

                    acc[fecha].push(pedido)
                    return acc;
                }, {})

                // Convertir a array de [fecha, pedidos] y ordenar por fecha
                setPedidosAgrupados(Object.entries(pedidosAgrupados).sort((a, b) => new Date(b[0]) - new Date(a[0])));

            } catch (error) {
                console.log('Error al obtener los pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    return (
        <div>
            <h2>Pedidos recibidos</h2>
            {pedidosAgrupados.map(([fecha, pedidos]) => (
                <div key={fecha}>
                    <h3>Pedidos {fecha}</h3>
                    <table className='pedidos__tabla'>
                        <thead>
                            <th className='pedidos__fila'>Nro.</th>
                            <th className='pedidos__fila'>Cliente</th>
                            <th className='pedidos__fila'>Hora</th>
                            <th className='pedidos__fila'>Total</th>
                            <th className='pedidos__fila'>Entrega/Retiro</th>
                        </thead>
                        <tbody>
                            {pedidos.map(pedido => (
                                <React.Fragment key={pedido.id}>
                                    <tr key={pedido.id}>
                                        <td className='pedidos__fila'>{pedido.id}</td>
                                        <td className='pedidos__fila'>{pedido.cliente}</td>
                                        <td className='pedidos__fila'>{pedido.hora}</td>
                                        <td className='pedidos__fila'>{pedido.total}</td>
                                        <td className='pedidos__fila'>
                                            {pedido.delivery ? pedido.lugar_envio : 'Retiro'}
                                        </td>
                                        <td className='pedidos__fila'>
                                            <button onClick={() => handleDetallesClick(pedido.id)}>
                                                {visibilidadDetalles[pedido.id] ? '-' : '+'}
                                            </button>
                                        </td>
                                    </tr>
                                    {visibilidadDetalles[pedido.id] && (
                                        <tr>
                                            <td className='pedidos__fila' colSpan="5">
                                                <h3>Detalle: </h3>
                                                {(detallesPedidos[pedido.id] || []).map(detallePedido => (
                                                    <div key={detallePedido.id} className="detalle-pedido">
                                                        {/* Mostrar el nombre del producto */}
                                                        <h4 className="producto-nombre">{detallePedido.nombre}</h4>
                                                        {/* Lista de ingredientes y otros detalles */}
                                                        <ul className="detalle-lista">
                                                            {detallePedido.ingredientes && (
                                                                <li>
                                                                    Ingredientes: {detallePedido.ingredientes.map((detalle, index) => (
                                                                        <span key={detalle.id} className="ingrediente">
                                                                            {detalle.nombre}{index < detallePedido.ingredientes.length - 1 && ','} 
                                                                        </span>
                                                                    ))}
                                                                </li>
                                                            )}
                                                            <li>Cantidad: {detallePedido.cantidad}</li>
                                                            <li>Total: {detallePedido.precio}</li>
                                                        </ul>
                                                    </div>
                                                ))}

                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default Pedidos;