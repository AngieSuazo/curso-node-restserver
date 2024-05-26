const { response } = require("express");
const { Usuario,Categoria, Producto } = require("../models");
const {ObjectId}=require ('mongoose').Types;

const coleccionesPermitidas=[
    'usuarios',
    'categoria',
    'productos',
    'roles'
];
const buscarUsuarios=async(termino ='', res= response)=>{
    const esMongoID= ObjectId.isValid(termino);//True

    if (esMongoID){
        const usuario =await Usuario.findById(termino);
        return res.json({
            //evitar mandar arreglo ya que podría creerse que hay por lo menos un resultado
            results:(usuario) ? [usuario] : [] //si usuaio es correcto devuelve arreglo de usuario sino devuelve arreglo vacío
        });
    }

    //Expresiones regulares para que se pueda buscar por mayúsculas o minúsculas
    const regex= new RegExp(termino,'i');//insensible a las mayúsculas

    const usuarios=await Usuario.find({ //Usuario.count contar cuántas respuestas hay 
        $or : [{nombre:regex }, {correo: regex}], //búsqueda por nombre o correo
        $and: [{estado: true}]  //tiene que cumplir esta condición 
    });

    return res.json({
        results:usuarios
    });

}

const buscarCategorias=async(termino ='', res= response)=>{
    const esMongoID= ObjectId.isValid(termino);//True

    if (esMongoID){
        const categoria =await Categoria.findById(termino);
        return res.json({
            results:(categoria) ? [categoria] : [] 
        });
    }

    const regex= new RegExp(termino,'i');

    const categorias=await Categoria.find({nombre:regex, estado: true });

    return res.json({
        results:categorias
    });

}

const buscarProductos=async(termino ='', res= response)=>{
    const esMongoID= ObjectId.isValid(termino);//True

    if (esMongoID){
        const producto =await Producto.findById(termino)
                                .populate('categoria', 'nombre');
        return res.json({
            results:(producto) ? [producto] : [] 
        });
    }

    const regex= new RegExp(termino,'i');

    const productos=await Producto.find({nombre:regex, estado: true })
                                .populate('categoria', 'nombre');

    return res.json({
        results:productos
    });

}


const buscar =(req,res=response)=>{
    const {coleccion, termino} = req.params;
 
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }
 
switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res);
            // res.status(200).json({
            //   //  msg: 'Exitoso.'
            // });
        break;
        case 'categoria':
            buscarCategorias(termino,res);
        break;
 
        case 'productos':
            buscarProductos(termino,res);
        break;
 
        default:
            res.status(500).json({
                msg: 'Se le olvidó hacer esta búsqueda.'
            });
    }

}

module.exports={
    buscar,
    buscarUsuarios
}