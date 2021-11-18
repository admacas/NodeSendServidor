const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt =require('jsonwebtoken');
//require('dotenv').config({path:'variables.env'});

exports.autenticarUsuario = async (req,res,next) => {

    // revisar si hay errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // extraer el email y el password
    const {email,password} = req.body;

    try {
         // revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email})
        if(!usuario){
            res.status(401).json({msg: 'El usuario no existe'});
            return next();
        }

        // revisar el password
        if ( bcrypt.compareSync(password,usuario.password) ) {
            // crear JWT
            const token = jwt.sign({
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email
            },process.env.SECRETA,{
                expiresIn: "8h" // 8 Horas
            });
            // mensaje de confirmacion
           res.json({token});
        }else{
            res.status(401).json({msg: 'El password es incorrecto'});
            return next();
        }

    } catch (error) {
        console.log(error);   
    }
}

// Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req,res) => {
    res.json({usuario: req.usuario});
}