const {Router}=require('express');
const { check } = require('express-validator');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router =Router();

router.post('/', validarArchivoSubir,cargarArchivo);

router.put('/:coleccion/:id', [ //en esta ruta recibimos un mongo id y una colección permitida 
    validarArchivoSubir,
    check('id', 'El ID debe ser de MongoDB').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas(c, ['usuarios','productos']) ), //colección tiene que estar dentro de un arreglo
    validarCampos
//], actualizarImagen
], actualizarImagenCloudinary
);

router.get('/:coleccion/:id', [
    check('id', 'El ID debe ser de MongoDB').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas(c, ['usuarios','productos']) ), //colección tiene que estar dentro de un arreglo
    validarCampos,
    mostrarImagen
], )




module.exports= router;