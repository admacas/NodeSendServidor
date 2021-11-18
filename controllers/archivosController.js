const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces =require('../models/Enlace')

exports.subirArchivo = async(req,res,next) => {

    const configMulter = {
        limits: {fileSize: req.usuario ? 1024*1024*10 : 1024*1024},
        storage: fileStorage = multer.diskStorage({
            destination: (req,file,cb) =>{
                cb(null,__dirname + '/../uploads')
            },
            filename: (req,file,cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length);
                cb(null,`${shortid.generate()}${extension}`);
            }
            // para filtrar archivos
            // fileFilter: (req,file,cb) => {
            //     if(file.mimetype === 'aplication/pdf'){
            //         return cb(null, true)
            //     }
            // }
        })
    }
    const upload = multer(configMulter).single('archivo');

    upload(req,res, async(error) => {
        
        if (!error) {
            res.json({archivo: req.file.filename})
        }else{
            console.log(error);
            return next();
        }

    });
    
}

exports.eliminarArchivo = async(req,res) => {
    //console.log(req.archivo);
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.log('archivo eliminado');
    } catch (error) {
        console.log(error);
    }
}

// desarga un archivo
exports.descargar = async(req,res,next) => {

    // obtine el enlace
    const enlace = await Enlaces.findOne({nombre:req.params.archivo})

    console.log(req.params.archivo);
    const archivo = __dirname + '/../uploads/' + req.params.archivo;
    res.download(archivo);

    // eliminar el archivo y la entrada de la base de datos
    const {descargas,nombre} = enlace;
    //  si las descargas son = a 1 - borrar la entrada y el archivo
    if (descargas ===1) {
        // eliminar el archivo
        req.archivo = nombre;
        // eliminar la entrada en la DB
        await Enlaces.findOneAndRemove(enlace.id);
        next();
    }else{
        //  si las descargas son > a 1 - restar 1
        enlace.descargas--;
        await enlace.save()
    }
}