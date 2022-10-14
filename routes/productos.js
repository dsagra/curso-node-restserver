const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductoPorId, obtenerProductos, actualizarProducto, eliminarProducto } = require('../controllers/productos_controller');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminrole } = require('../middlewares');


const router = Router();

// obtener todas las productos - publico
router.get('/',
    obtenerProductos
);

// obtener una producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProductoPorId);

// crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],
    crearProducto
);

// update producto - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos,
], actualizarProducto);

// delete producto - Admin
router.delete('/:id',
    [
        validarJWT,
        esAdminrole,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos,
    ], eliminarProducto);



module.exports = router;