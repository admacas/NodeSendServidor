const jwt =require('jsonwebtoken');

module.exports = (req,res,next) => {
    // realizar la autenticacion sin middleware
    const authHeader = req.get('Authorization');

    if (authHeader) {
        // obtnener le token
        const token = authHeader.split(' ')[1];
        // comprobar el JWT
        try {
            const usuario = jwt.verify(token, process.env.SECRETA);
            req.usuario = usuario;
        } catch (error) {
            //res.status(401).json({msg: 'Token no válido'});
            console.log('JWT no válido');
        }   
    }
    return next();
}