const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usersGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    if (isNaN(limite) || isNaN(desde)) {
        return res.status(400).json({
            msg: 'El limite y el desde deben ser numeros'
        });
    }
    // const usuarios =  Usuario.find(query).skip(Number(desde))
    //     .limit(Number(limite));

    // const total =  Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}


const usersPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(
        usuario
    );
}


const usersPost = async (req, res = response) => {
    const { nombre, password, correo, rol } = req.body;
    const usuario = new Usuario({ nombre, password, correo, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.json({
        usuario
    });
}


const usersDelete = async (req, res = response) => {
    const { id } = req.params;

    const uid = req.uid;
    const usuarioAutenticado = req.usuario;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    res.json({
        usuario, uid, usuarioAutenticado
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}