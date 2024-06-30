const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/client.controller");
const validate = require("../../validate/client/client.validate");

router.get('/register', controller.getRegister);

router.post('/register', validate.validatePostClient, controller.postRegister);

router.get('/login', controller.getLogin);

router.post('/login', controller.postLogin);

module.exports = router;