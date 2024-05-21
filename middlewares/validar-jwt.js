const {response,request}=require('express');
const jwt=require('jsonwebtoken');
const Usuario=require('../models/usuario');

const validarJWT = async(req,res=response,next)=>{//los middle tienen estas 3 partes
    
    const token=req.header('x-token');//se especifica como le solicitamos al front 
   
   if (!token){
        return res.status(401).json({
        msg: 'No hay token en la petición'
    });
   }

   try {
        const {uid}=jwt.verify(token, process.env.SECRETORPRIVATEKEY); //extraemos el uid del usuario
    
        const usuario= await Usuario.findById(uid);//leer usuario que corresponde al uid, si no encuentra es usuario undefined 
        if (!usuario){
            return res.status(401).json({
                msg:'Token no válido-usuario no existe en BD'
            })
        }
        //verificar si el uid está en estado true
        if (!usuario.estado){
            return res.status(401).json({
                msg:'Token no válido-usuario con estado:false'
            })
        }
        
        req.usuario= usuario;// está guardando el objeto de usuario en el objeto req (request) de Express.
                            /**Este objeto req representa la solicitud HTTP que se recibe en el servidor. Entonces, el usuario se almacena como una propiedad llamada usuario en el objeto req, y 
                             * esta información estará disponible para su uso posterior en la manipulación de la solicitud */
        next();
        ///// req.uid=uid;//creamos propiedad nueva por referencia, el req pasa por los middle, hasta el usuario delete par aluego extraerlo
   
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
    })
    }

}
module.exports={
    validarJWT
}