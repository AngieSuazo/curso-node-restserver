const {response} = require ('express');
const bcryptjs= require('bcryptjs');
const Usuario=require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login= async(req, res= response)=> {


    const {correo, password}=req.body;


    try {

        //Verificar si el correo existe
        const usuario =await Usuario.findOne({correo});
        if (!usuario){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos -correo' 
            })
        }  
        //Si el usuario está activo en la BD
        if (!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos -estado:false' 
            })
        }  
        //Verificar la contraseña
        const validPassword= bcryptjs.compareSync(password, usuario.password);
         if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos -password incorrecto' 
           })
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);
    
    
        res.json({ //Mantener solo un res.json en el controlador 
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contactar al administrador'
        })
    }
}

const googleSignIn=async(req ,res=response)=>{
    const {id_token}=req.body;
    try {
        const {correo,nombre,img}=await googleVerify(id_token);
        //console.log(googleUser);
        let usuario =await Usuario.findOne({correo}); //verificar si el correo ya existe en la BD
        if (!usuario){ //ai usuario no existe. . .
            //Crear usuario
            const data ={
                nombre,
                correo,
                password: ':P',
                img,
                google:true
            };
            usuario= new Usuario(data); //creamos
            await usuario.save();//guardamos en la BD
        }
        //Si el usuario en la DB
        if (!usuario.estado ){ //si el usuario de google tiene su estado false, se niega autenticación en mi aplicación 
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        } 
        //Generar el JWT
        const token = await generarJWT(usuario.id);
 
        res.json({
            msg: 'Todo ok google signin',
             usuario,
             token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
        
    }
}

module.exports={
    login,
    googleSignIn
}