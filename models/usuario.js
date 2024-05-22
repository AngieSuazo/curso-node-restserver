const {Schema,model}=require('mongoose');

const UsuarioSchema=Schema({
    nombre:{
        type:String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type:String,
        required:[true,'El correo es obligatorio'],
        unique:true
    },
    password:{
        type:String,
        required: [true,'La contraseña es obligatoria']
    },
    img:{
        type: String
    },
    rol:{
        type:String,
        required:true,
        emun: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    estado:{
        type:Boolean,
        default:true
    },
    google: {
        type:Boolean,
        default:false
    },
});
//Sobreescribir métodos, debe ser función normaly ya que se debe usar el this, dirigiendose a la instancia creada
//con sus valores respectivos como si fuera un objeto literal de JS con su nombre, etc 
UsuarioSchema.methods.toJSON =function (){
    const {__v, password,_id,... usuario}= this.toObject(); //quitamos el _ _ v y el password que se observan en postman con el operador rest . . .  unificamos los otros valores en uno solo llamado usuario, usamos la desestructuración
     usuario.uid=_id;                                      // cambiamos visualmente en postman
    return usuario;//retornando el usuario creado con spread
}

module.exports= model('Usuario',UsuarioSchema);