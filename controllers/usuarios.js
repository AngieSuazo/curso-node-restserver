//Para al poner .res aparezcan las funciones
const {response, request}=require('express');
const bcrypt= require('bcryptjs');
const Usuario= require('../models/usuario');


const usuariosGet= async(req=request, res=response) => {

    const {limite =5,desde=0}= req.query;
    const query= {estado :true};
    
    const [total,usuarios]= await Promise.all([  //Respuesta es colección de promesas, await para que espere resolución de ambas, y desestructuración de arreglos 
      Usuario.countDocuments(query),
      Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
      
      total,
      usuarios
    });
    
}

const usuariosPost= async(req, res= response) => {

  //const body=req.body; pasamos a desetructurar
  const {nombre,correo,password,rol}=req.body
  const usuario=new Usuario({nombre,correo,password,rol});//crear instance, campos que quiero guardar en la creación del usuario 
 
  //Encriptar contraseña
  const salt=bcrypt.genSaltSync();//Salt número de vueltas para complicar encriptación, defecto es 10
  usuario.password=bcrypt.hashSync(password,salt);//hash para encriptarlo en una sola vía, pide l password y las vueltas
  
  //Guardar en BD
  await usuario.save();
  res.status(201).json({
      usuario
  })
  }

const usuariosPut= async(req, res= response) => {

  const { id} = req.params;
    const {_id,password,google,correo, ... resto}=req.body;//datos que no quiere actualizar 

    if (password){
    //Encriptar contraseña
    const salt=bcrypt.genSaltSync();
    resto.password=bcrypt.hashSync(password,salt);
    }

  const usuario =await Usuario.findByIdAndUpdate(id,resto);
  
    res.json(usuario);
  }

const usuariosPatch= (req, res) => {
    res.json({
        msg:'patch Api-controlador'
    })
  }

const usuariosDelete= async(req, res) => {
  const {id}=req.params;
  const usuario= await Usuario.findByIdAndUpdate(id, {estado:false}); 
  /////const usuarioAutenticado=req.usuario; hay información del usuario
  res.json(usuario);//solo devuelve usuario modificado 
  /////const uid=req.uid; //de validar-jwt sigue el req no correcto porque se debe validar el rol del usuario 
  /////Físicamente lo borramos de l BD
  ////const usuario =await Usuario.findByIdAndDelete(id);
  }


  module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
  }

