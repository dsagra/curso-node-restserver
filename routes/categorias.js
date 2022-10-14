const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoriaPorId, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { validarJWT, validarCampos, esAdminrole } = require('../middlewares');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

// obtener todas las categorias - publico
router.get('/',
    obtenerCategorias
);

// obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoriaPorId);

// crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],
    crearCategoria
);

// update categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], actualizarCategoria);

// delete categoria - Admin
router.delete('/:id',
    [
        validarJWT,
        esAdminrole,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos,
    ], eliminarCategoria);


module.exports = router;
