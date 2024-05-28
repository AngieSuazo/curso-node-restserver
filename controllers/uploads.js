const path= require('path');
const fs =require ('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL); //autenticando cuenta
const { response } = require("express");
const { subirArchivo } = require("../helpers");

const {Usuario, Producto}=require('../models');

const cargarArchivo = async(req, res=response)=>{

    try {
        //const nombre= await subirArchivo(req.files, ['txt','md'], 'textos');
        const nombre= await subirArchivo(req.files, undefined, 'imgs');
        res.json({nombre})
         
        
    } catch (msg) {
        res.status(400).json({msg})

    }
}

const actualizarImagen= async( req, res=response)=>{
    
    const {id, coleccion} =req.params;

    let modelo; 

    switch (coleccion) {
        case 'usuarios':
        modelo= await Usuario.findById(id);
        if(!modelo){
            return res.status(400).json({
                msg: `No existe un usuario con el id ${id}`
            })
        }
        break;
    
        case 'productos':
        modelo= await Producto.findById(id);
        if(!modelo){
            return res.status(400).json({
                msg: `No existe un producto con el id ${id}`
            })
        }
        break;

        default:
        return res.status(500).json({msg:'Se me olvidó validar esto' });
    }

    //Limpiar imágenes previas
    if (modelo.img){
        //Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); //buscamos todo el path a borrar
        if (fs.existsSync(pathImagen)){  //si existe
            fs.unlinkSync(pathImagen); //borrar la imagen usando su path 
        }

    }


    //Actualizar
    const nombre= await subirArchivo(req.files, undefined, coleccion); //crea carpeta con el nombre de la colección
    modelo.img = nombre;
    await modelo.save();

    res.json(modelo);
} 


const mostrarImagen =async (req, res=response) =>{

    const {id, coleccion} =req.params;

    let modelo; 

    switch (coleccion) {
        case 'usuarios':
        modelo= await Usuario.findById(id);
        if(!modelo){
            return res.status(400).json({
                msg: `No existe un usuario con el id ${id}`
            })
        }
        break;
    
        case 'productos':
        modelo= await Producto.findById(id);
        if(!modelo){
            return res.status(400).json({
                msg: `No existe un producto con el id ${id}`
            })
        }
        break;

        default:
        return res.status(500).json({msg:'Se me olvidó validar esto' });
    }

    //Limpiar imágenes previas
        if (modelo.img){
        //Hay que borrar la imagen previa del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); //buscamos todo el path a borrar
        if (fs.existsSync(pathImagen)){  //si existe
            return res.sendFile(pathImagen) //responder con la imagen 
        } else {
            return res.redirect(modelo.img) //*PERMITE VER IMAGEN DE CLOUDINARY
        }
    }
        //Si no hay imagen responde no image 
        const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathImagen);

        ////Para ver imagen de Cloudinary
        //// if ( modelo.img ) {
        //     // return res.json({   //?devulve la ruta de la imagen http:cloudinary....
        //     //     img: modelo.img 
        //     // });
        
}


const actualizarImagenCloudinary= async( req, res=response)=>{
    
    const {id, coleccion} =req.params;

    let modelo; 

    switch (coleccion) {
        case 'usuarios':
        modelo= await Usuario.findById(id);
        if(!modelo){
            return res.status(400).json({
                msg: `No existe un usuario con el id ${id}`
            })
        }
        break;
    
        case 'productos':
        modelo= await Producto.findById(id);
        if(!modelo){
            return res.status(400).json({
                msg: `No existe un producto con el id ${id}`
            })
        }
        break;

        default:
        return res.status(500).json({msg:'Se me olvidó validar esto' });
    }

    //Limpiar imágenes previas
    if (modelo.img){
      const nombreArr =modelo.img.split('/'); //tenemos todo el link de img, vamos separándolo
      const nombre=nombreArr[nombreArr.length-1]; //última posición 
      const [public_id]= nombre.split('.');//desetructuramos para solo tener el id sin la extensión (bisadbsid.jpg)
      await cloudinary.uploader.destroy(public_id);//teniendo el public id tmb lo podemos eliminar 
    }
    //Subir a Cloudinary
    const {tempFilePath}=req.files.archivo
    const {secure_url}=await cloudinary.uploader.upload(tempFilePath); //link de imagen subida a cloudinary
    modelo.img = secure_url;
    await modelo.save();
    res.json(modelo);//devuelve el modelo incluyendo el link url de cloudinary donde la imagen está alojada 

} 


module.exports={
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary

}