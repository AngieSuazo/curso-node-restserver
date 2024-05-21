const jwt =require ('jsonwebtoken');

const generarJWT=(uid='')=>{ //user identifier 

    return new Promise((resolve,reject)=>{

    const payload={uid}; //se puede almacenar nombre, rol, correo, telef, etc pero no es seguro

    jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{ //sign para firmar nuevo token
        expiresIn:'4h' //365d
    },(err,token)=>{ //callback final
        if (err){
            console.log(err);
            reject('No se pudo generar el token')
        }else{
            resolve(token);
        }
    })
})
}

module.exports={
    generarJWT
}