import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../../../shared/styles/MenuList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../../app/context/CartContext';
import CustomizationModal from '../components/CustomizationModal';
import Overlay from '../../../shared/ui/Overlay';
import Loading from '../../../shared/ui/Loading';

function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/menu`);
        const responseCategorias = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categorias`);

        const categoriasOrdenadas = responseCategorias.data.sort((a, b) => a.orden - b.orden);

        setMenuItems(response.data);
        setCategorias(categoriasOrdenadas);
      } catch (error) {
        console.error('Error al obtener el menú:', error);
        setError('Hubo un problema al obtener el menú. Por favor, espera 1 minuto e intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.tipo_id]) {
      acc[item.tipo_id] = [];
    }
    acc[item.tipo_id].push(item);
    return acc;
  }, {});

  const handleAddToCart = (item) => {
    if (item.tipo_combinacion !== 4 && item.tipo_combinacion !== null) {
      setCustomizingItem(item);
    } else {
      addToCart(item);
    }
  };

  const handleCloseModal = () => {
    setCustomizingItem(null);
  };

  if (loading) return <Loading />

  return (
    <div className="md:p-108 flex flex-col items-center">
      <Overlay isOpen={showOverlay} onClose={() => setShowOverlay(false)} />
      <h1 className="font-paytone md:my-10 my-5 text-3xl font-bold text-center">MENÚ</h1>
      {error && <p>{error}</p>}

      <div className="font-comfortaa">
        {categorias.map(categoria => (
          <div className='md:px-60 md:mb-20' key={categoria.id}>
            <div className="my-5 md:my-10 flex items-center justify-center space-x-4">
              <h2 className="text-2xl font-semibold">{categoria.nombre}</h2>
              <div className="md:flex-grow md:border-t-2 md:border-gray-300" />
            </div>

            <div className="p-4 md:p-0 flex gap-2 grid grid-cols-1 sm:grid-cols-1 sm:gap-3 md:grid-cols-3 ">
              {groupedMenuItems[categoria.id] && groupedMenuItems[categoria.id].length > 0 ?
                (groupedMenuItems[categoria.id].filter(item => item.activo).map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg flex flex-col gap-4 sm:gap-6 border-b sm:text-xl "
                  >
                    {item.tipo_id === 5 ? (
                      <div className='p-8 flex flex-col
                                      items-center gap-5'>
                        {/* Aquí defines el diseño especial para el item con id 5 */}
                        <h3 className="text-sm sm:text-xl font-semibold">{item.nombre}</h3>
                        <span className='text-center font-bold'>${item.precio}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-1/2 py-2 mx-auto
                                        text-xs md:text-base
                                        rounded-md bg-yellow-300 
                                        hover:bg-yellow-400">
                          {item.tipo_combinacion !== 4 && item.tipo_combinacion !== null ? 'Personalizar' : 'Agregar'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex md:flex-col md:max-w-sm">
                        {/* Contenedor con alto fijo */}


                        <div class="aspect-square w-1/2 md:w-full overflow-hidden rounded-lg">
                          <img
                            src={item.image_url}
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>


                        <div className='p-6 md:px-6 w-1/2 gap-2 md:gap-5 
                                        flex flex-col items-end md:items-start justify-evenly md:justify-center
                                        text-right md:text-left  
                                        md:w-full'>
                          <h3 className="text-sm sm:text-xl font-bold">{item.nombre}</h3>
                          <p
                            className='text-xs md:text-base line-clamp-3  md:line-clamp-2 md:h-[50px]'
                            title={item.descripcion}>
                            {item.descripcion}
                          </p>
                          <span className='text-center font-semibold'>${item.precio}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-full md:w-1/2 py-2 md:mx-auto
                                        text-xs md:text-base
                                        rounded-md bg-yellow-300 
                                        hover:bg-yellow-400">
                            {item.tipo_combinacion !== 4 && item.tipo_combinacion !== null ? 'Personalizar' : 'Agregar'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))) : (<div className="col-span-full text-center py-6 text-gray-500">
                  Muy pronto podrás disfrutar de este nuevo plato
                </div>)}
            </div>
            <div className="w-1/3 h-0.5 bg-gray-300 mx-auto my-4 md:hidden"></div>
          </div>
        ))}
        {customizingItem && (
          <CustomizationModal
            item={customizingItem}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default MenuList;
