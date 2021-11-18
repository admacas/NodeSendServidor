const Enlaces = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async(req,res) => {
    // revisar si hay errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }
    // crear objeto enlace
    const {nombre_original,nombre} = req.body;
    try {
        const enlace = new Enlaces();
        enlace.url = shortid.generate();
        enlace.nombre = nombre;
        enlace.nombre_original = nombre_original;
        enlace.descargas = 1;
       
        // si el usuario esta autenticado
        if (req.usuario) {
            const {password,descargas} = req.body;
            // Asignar a enlace al numero de descargas
            if (descargas) {
                enlace.descargas = descargas; 
            }
            // Asignar un password
            if (password) {
                const salt = await bcrypt.genSalt(10);
                enlace.password = await bcrypt.hash(password,salt);
            }
            // asignar el autor
            enlace.autor = req.usuario.id
        }
        await enlace.save();
        res.json({msg: `${enlace.url}`});
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }

    
}

// obtener enlace

exports.obtenerEnlace = async(req,res,next) => {
   
    // verificar si existe el enelace
    const {url} = req.params;
    const enlace = await Enlaces.findOne({url});
    if (!enlace) {
        res.status(404).json({msg: 'Enlace no existe'});
        next();
    }
    // si el enlace existe
    res.json({archivo: enlace.nombre,password:false});
    
    next();   
}

// obtiene todos los enlaces
exports.todosEnlaces = async(req,res) => {
    try {
        const enlaces = await Enlaces.find({}).select('url -_id');  
        res.json({enlaces});
    } catch (error) {
        console.log(error);
    }
}

// retorn si el enlace tiene pASSWORD O NO
exports.tienePassword = async (req,res,next) => {
    // verificar si existe el enelace
    const {url} = req.params;
    const enlace = await Enlaces.findOne({url});
    if (!enlace) {
        res.status(404).json({msg: 'Enlace no existe'});
        next();
    }
    if (enlace.password) {
        return res.json({password: true, enlace: enlace.url,archivo: enlace.nombre});
    }
    next();
}

// verifica si el password es correcto
exports.verificarPassword = async (req,res,next) => {
    const {url} = req.params;
    const {password} = req.body;

    // consulta por el enlace
    const enlace = await Enlaces.findOne({url});

    // verificar el password
    if (bcrypt.compareSync(password,enlace.password)) {
        // permitir al usuario descargar el archivo
        next();
    }else{
        return res.status(401).json({msg: 'Password incorrecto'})
    }

}
