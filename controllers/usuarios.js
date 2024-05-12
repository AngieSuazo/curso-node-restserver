//Para al poner .res aparezcan las funciones
const {response, request}=require('express');

const usuariosGet= (req=request, res=response) => {
    
    //const query=req.query;
    const {q,nombre ='No name',apikey,page =1,limit}=req.query;
    res.json({
        msg:'get Api-controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
    
}

const usuariosPost= (req, res) => {
    //const body=req.body; pasamos a desetructurar
    const {nombre,edad}=req.body

    res.status(201).json({
        msg:'post Api-controlador',
        nombre,
        edad
    })
  }

const usuariosPut= (req, res) => {
    const {id}=req.params;
    res.status(500).json({
        msg:'put Api-controlador',
        id
    });
  }

const usuariosPatch= (req, res) => {
    res.json({
        msg:'patch Api-controlador'
    })
  }

const usuariosDelete= (req, res) => {
    res.json({
        msg:'delete Api-controlador'
    })
  }


  module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
  }

