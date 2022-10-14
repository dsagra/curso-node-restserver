const { response } = require('express');
const { Producto } = require('../models');



const crearProducto = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;
    const categoria = req.body.categoria;

    const productoDB = await Producto.findOne({ nombre });
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }
    //Generar la data a guardar
    const data = {
        nombre,
        precio,
        descripcion,
        usuario: req.usuario._id,
        categoria
    }
    const producto = new Producto(data);
    //Guardar DB
    await producto.save();
    res.status(201).json(producto);
}

const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre').populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        productos
    });
}
const obtenerProductoPorId = async (req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    res.json(producto);
}

const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    const productoDB = await Producto.findOne({ nombre: data.nombre });
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }
    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });



    res.json(producto);

}
const eliminarProducto = async (req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false });
    res.json(producto);
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
}
