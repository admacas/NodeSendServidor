const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {check} = require('express-validator');
const auth = require('../middleware/auth');
// Iniciar sesion

router.post('/', 
    [
        check('email','Agrega un email válido').isEmail(),
        check('password','El passwor no puede ir vacio').not().isEmpty()
    ],
    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;
