const { response } = require("express")

const validarArchivoSubir= (req, res=response, next)=>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) { //Barrido de todos los files, si vienen alguna propiedad ||Necesito el mombre del archivo
        res.status(400).json({msg:'No haya archivos que subir-validarArchivoSubir'});
        return;
    }
    next();
}

module.exports={
    validarArchivoSubir
}