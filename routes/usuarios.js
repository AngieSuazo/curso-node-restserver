const {Router}=require('express');
const { check } = require('express-validator');
const Role =require('../models/role');
const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

        
const router =Router();

  router.get('/',usuariosGet);//no ejecutar función, hacer referencia a la misma
  router.put('/:id',[
      check('id','No es un ID válido').isMongoId(),
      check('id').custom(existeUsuarioPorId),
      check('rol').custom( esRoleValido),
      validarCampos
  ], usuariosPut);

  router.post('/',[
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser más de 6 letras').isLength({min:6}),
        check('correo').custom( emailExiste),
        //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('rol').custom( esRoleValido),
        validarCampos
  ] ,usuariosPost); 
  router.delete('/:id',[
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos

  ], usuariosDelete);
  router.patch('/', usuariosPatch);

  module.exports=router;