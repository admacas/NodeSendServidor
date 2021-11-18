const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowercase: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registro:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Usuarios',usuarioSchema);