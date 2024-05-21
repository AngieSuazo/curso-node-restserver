const { response} = require("express");

const esAdminRole=(req, res=response, next)=>{
    if(!req.usuario){ //el middle validarJWT establece la info del usuario en el mismo req.usuario
        return res.status(500).json({
            msg:' Se quiere verificar el role sin validar el token primero' //que no devuelva undefined
        });
    }
    const {rol,nombre}=req.usuario;
    if (rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        });
    }
    next();
}

const tieneRole=(...roles)=>{//mandamos todo los roles en un arreglo

    return (req, res=response, next)=>{ //debe devolver una función, recibiendo los argumentos de adminRole
     
        if(!req.usuario){ //el middle validarJWT establece la info del usuario en el mismo req.usuario
            return res.status(500).json({
                msg:' Se quiere verificar el role sin validar el token primero' //que no devuelva undefined
            });
        }

        if (!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }
        ////console.log(roles, req.usuario.rol);//rol de models/usuario
        next();

    }

}

module.exports={
    esAdminRole,
    tieneRole
}