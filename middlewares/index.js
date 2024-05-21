//constantes que contienen todo lo que exportan los archivos
const validaCampos = require('../middlewares/validar-campos');
const validarJWT  = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

//SE EXPORTA CON EL OPERADOR SPREAD
module.exports={
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
}