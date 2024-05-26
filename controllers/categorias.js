const { response } = require("express");
const {Categoria }= require('../models');


const obtenerCategorias=async (req,res=response)=>{
    
    const {limite =5,desde=0}= req.query;
    const query= {estado :true};
    
    const [total,categorias]= await Promise.all([  //Respuesta es colección de promesas, await para que espere resolución de ambas, y desestructuración de arreglos 
      Categoria.countDocuments(query),
      Categoria.find(query)
        .populate('usuario', 'nombre') //quién lo creó y su uid
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
      total,
      categorias
    });
}

const obtenerCategoria =async(req,res=response)=>{
    const {id} =req.params;
    const categoria =await Categoria.findById(id).populate('usuario','nombre');

    res.json(categoria);

}

const crearCategoria =async (req,res=response)=>{
    //Leemos el nombre del body
    const nombre = req.body.nombre.toUpperCase(); //almacenar categorías en mayúsculas, para que choque si alguien crea otra categoría con el mismo nombre
    
    //Si existe categoría previamente grabada
    const categoriaDB=await Categoria.findOne({nombre});

    if (categoriaDB){
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre}, ya existe`
        });
    }
    //Generar data a guardar
    const  data ={
        nombre,
        usuario: req.usuario._id
    }

    //Crear categoría
    const categoria =new Categoria(data);

    //Guardar en DB
    await categoria.save();

    //Imprimimos
    res.status(201).json(categoria);
}

const actualizarCategoria=async(req,res=response)=>{
    const {id}=req.params;
    const {estado,usuario, ...data}=req.body;

    data.nombre=data.nombre.toUpperCase(); //nombre capitalizado dela categoría que estamos modificando
    data.usuario=req.usuario._id; //id del usuario dueño del token que está usando para actualizar 

    const  categoria= await Categoria.findByIdAndUpdate(id,data,{new:true}); //mandar el nuevo doc atualizado en la respuesta la info nueva
    res.json(categoria);
}

//borrarCategoria-estado : false
const borrarCategoria=async(req,res =response)=>{
    const {id}=req.params;
    const categoriaBorrada= await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});
    res.json(categoriaBorrada);
}

module.exports={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}