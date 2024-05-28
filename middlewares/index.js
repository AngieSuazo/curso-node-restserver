//constantes que contienen todo lo que exportan los archivos
const validaCampos = require('../middlewares/validar-campos');
const validarJWT  = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarArchivo= require('../middlewares/validar-archivo');

//SE EXPORTA CON EL OPERADOR SPREAD
module.exports={
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo,
}