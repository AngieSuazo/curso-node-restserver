const path = require('path');
const { v4: uuidv4 } = require('uuid');
const subirArchivo=(files , extensionesValidas =['png','jpg','jpeg','gif'], carpeta = '')=>{

    return new Promise((resolve,reject)=>{

        const {archivo} = files;
        const nombreCortado  = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];
        
        //Validar la extension
        if ( !extensionesValidas.includes(extension)){
            return reject (`La extensión ${extension} no es permitida, ${extensionesValidas}`);
        }
    
        //Renombrar la imagen
        const nombreTemp = uuidv4() + '.' + extension;//concatenar
        const uploadPath = path.join( __dirname,'../uploads/',carpeta,nombreTemp); //unir pedazos de path 
      
        archivo.mv(uploadPath, function(err) {
          if (err) {
            reject(err);
          }
          resolve(nombreTemp);
        });

    })

}

module.exports={
    subirArchivo
}