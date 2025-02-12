// controllers/menuController.js
const { getMenu, getPlateById, searchPlates, subirPlato, editarPlato, borrarPlato } = require('../models/menuModel');
const cloudinary = require('../cloudinary');
const sharp = require('sharp');
const stream = require('stream');

const menuController = {
  //Función para manejar la solicitud de obtener el menú
  getMenu: async (req, res) => {
    try {
      const menu = await getMenu();
      res.json(menu);
      // Envía el menú como respuesta en formato JSON
    }
    catch (error) {
      console.error("Error al obtener el menú")
    }
  },

  getPlateById: async (req, res) => {
    try {
      const id = parseInt(req.params.id); // Obtiene el ID del parámetro de la solicitud
      if (isNaN(id)) {
        return res.status(400).send("Id inválido");
      }
      const plate = await getPlateById(id);
      if (plate) {
        // console.log -> Mensaje en terminal
        console.log(`Plato con ID ${id} encontrado`); // Mensaje informativo
        res.json(plate);
      } else {
        res.status(404).send("Plato no encontrado");
      }
    } catch (error) {
      //comilla invertida en idioma ENG debajo de ESC
      console.error(`Error en el controlador al obtener el plato con id = ${req.params.id}: `, error)
      res.status(500).send("Error al obtener plato")
    }
  },

  // Controlador para buscar en el menú
  searchPlates: async (req, res) => {
    const { term } = req.query; // Obtener el término de búsqueda de los parámetros de consulta
    try {
      const result = await searchPlates(term);
      res.json(result);
    } catch (error) {
      console.error('Error al buscar en el menú:', error);
      res.status(500).send('Error al buscar en el menú');
    }
  },

  // Controlador para subir plato
  subirPlato: async (req, res) => {
    console.log('Cuerpo de la solicitud (req.body):', req.body);
    const { nombre, descripcion, precio, tipo_id, tipo_combinacion, tipo_ingrediente } = req.body;

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Imagen no proporcionada' });
      }

      // Redimensionar la imagen a 400px de ancho manteniendo la relación de aspecto
      const resizedBuffer = await sharp(req.file.buffer)
        .resize(400) // Redimensionar a 400px de ancho
        .toBuffer(); // Convertir a buffer

      const uploadStream = cloudinary.uploader.upload_stream(async (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error al subir la imagen' });
        }
        const image_url = result.secure_url; // Obtén la URL de la imagen

        try {
          const plato = await subirPlato(nombre, descripcion, precio, tipo_id, image_url, tipo_combinacion);
          res.status(201).json({ plato: plato });
        } catch (error) {
          console.error('Error al subir plato en controller: ', error);
          res.status(500).send('Error al subir plato controller');
        }
      });

      // Envía el buffer redimensionado a Cloudinary
      const bufferStream = new stream.PassThrough();
      bufferStream.end(resizedBuffer); // Usamos el buffer redimensionado
      bufferStream.pipe(uploadStream); // Pasa el buffer al stream de Cloudinary

    } catch (error) {
      console.error('Error en el controlador al subir plato: ', error);
      res.status(500).send('Error al subir plato controller');
    }
  },

editarPlato: async (req, res) => {
  console.log('Cuerpo de la solicitud (req.body):', req.body);
  const id = req.params.id;
  const { nombre, descripcion, precio, tipo_id, tipo_combinacion, tipo_ingrediente } = req.body;

  try {
    let image_url;

    // Función para continuar editando el plato en la base de datos
    const continuarEdicion = async () => {
      try {
        // Si no hay nueva imagen, no actualizamos el campo de la imagen
        const plato = await editarPlato(id, nombre, descripcion, precio, tipo_id, image_url, tipo_combinacion, tipo_ingrediente);
        res.status(200).json({ plato }); // Respuesta exitosa
      } catch (error) {
        console.error('Error al editar plato en controller: ', error);
        res.status(500).send('Error al editar plato en controller');
      }
    };

    // Verifica si el plato ya tiene una imagen existente
    const platoExistente = await obtenerPlatoPorId(id); // Asegúrate de tener esta función implementada para obtener el plato de la BD
    image_url = platoExistente.image_url; // Si no se actualiza la imagen, mantenemos la existente

    // Si hay una imagen en la solicitud, redimensionarla y subirla
    if (req.file) {
      // Redimensionar la imagen a 400px de ancho manteniendo la relación de aspecto
      const resizedBuffer = await sharp(req.file.buffer)
        .resize(400) // Redimensionar a 400px de ancho
        .toBuffer(); // Convertir a buffer

      // Subir la imagen a Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error al subir la imagen' });
        }
        image_url = result.secure_url; // Guarda la URL de la imagen subida
        continuarEdicion(); // Llama a la función para continuar editando el plato
      });

      // Envía el buffer redimensionado a Cloudinary
      const bufferStream = new stream.PassThrough();
      bufferStream.end(resizedBuffer);
      bufferStream.pipe(uploadStream);
    } else {
      // Si no hay imagen nueva, continuar con la edición con la imagen existente
      continuarEdicion();
    }

  } catch (error) {
    console.error('Error en el controlador al editar plato: ', error);
    res.status(500).send('Error al editar plato en el controller');
  }
},

// controllers/menuController.js
 borrarPlato : async (req, res) => {
    const id = req.params.id;
    try {
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'ID no válido' });
        }

        const result = await borrarPlatoFromDB(id); // Implementa esta función para borrar el plato
        if (result) {
            res.status(200).json({ message: 'Plato eliminado con éxito' });
        } else {
            res.status(404).json({ message: 'Plato no encontrado' });
        }
    } catch (error) {
        console.error('Error al borrar plato:', error);
        res.status(500).json({ message: 'Error al eliminar el plato' });
    }
}
  
  
};

module.exports = menuController;
