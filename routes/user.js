const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPut, usersPost, usersDelete } = require('../controllers/user.controller');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminrole, tieneRole } = require('../middlewares');

const router = Router();

router.get('/', usersGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos,
],
    usersPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos,
    usersPost]);

router.delete('/:id', [
    validarJWT,
    // esAdminrole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),

    validarCampos,
], usersDelete);

module.exports = router;