const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/client.controller");
const validate = require("../../validate/client/client.validate");

router.get('/register', controller.getRegister);

router.post('/register', validate.validatePostRegister, controller.postRegister);

router.get('/login', controller.getLogin);

router.post('/login', validate.validatePostLogin, controller.postLogin);

router.post('/logout', controller.postLogout);

module.exports = router;