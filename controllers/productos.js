const { response } = require("express");
const {Producto }= require('../models');

const obtenerProductos=async (req,res=response)=>{
    
    const {limite =5,desde=0}= req.query;
    const query= {estado :true};
    
    const [total,productos]= await Promise.all([  //Respuesta es colección de promesas, await para que espere resolución de ambas, y desestructuración de arreglos 
      Producto.countDocuments(query),
      Producto.find(query)
        .populate('usuario', 'nombre') //quién lo creó y su uid
        .populate('categoria', 'nombre') //MODIFICACIÓN VS CATEGORIA CONTROLLER
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
      total,
      productos
    });
}

const obtenerProducto =async(req,res=response)=>{
    const {id} =req.params;
    const producto =await Producto.findById(id)
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');

    res.json(producto);
}

const crearProducto =async (req,res=response)=>{
    //Leemos el nombre del body
    const {estado,usuario,...body }= req.body; 
    
    //Si existe producto previamente grabada
    const productoDB=await Producto.findOne({nombre: body.nombre});//MODIFICADO VS CATEGORIA 

    if (productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }
    //Generar data a guardar
    const  data ={
        ...body, //MODIFICADO VS CATEGORIA
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    //Crear producto
    const producto =new Producto(data);

    //Guardar en DB
    await producto.save();

    //Imprimimos
    res.status(201).json(producto);
}

const actualizarProducto=async(req,res=response)=>{
    const {id}=req.params;
    const {estado,usuario, ...data}=req.body;

    if (data.nombre){
        data.nombre=data.nombre.toUpperCase(); //nombre capitalizado del producto que estamos modificando
    }
    data.usuario=req.usuario._id; //id del usuario dueño del token que está usando para actualizar 

    const  producto= await Producto.findByIdAndUpdate(id,data,{new:true}); //mandar el nuevo doc atualizado en la respuesta la info nueva
    res.json(producto);
}

const borrarProducto=async(req,res =response)=>{
    const {id}=req.params;
    const productoBorrado= await Producto.findByIdAndUpdate(id,{estado:false},{new:true});
    res.json(productoBorrado);
}

module.exports={
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}