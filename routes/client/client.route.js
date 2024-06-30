const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/client.controller");
const validate = require("../../validate/client/client.validate");
const JWTAction = require("../../middleware/client/JWTAction");

router.get('/register', controller.getRegister);

router.post('/register', validate.validatePostRegister, controller.postRegister);

router.get('/login', controller.getLogin);

router.post('/login', validate.validatePostLogin, controller.postLogin);

router.post('/logout', controller.postLogout);

router.get('/forgot-password', controller.getForgotPassword);

router.post('/forgot-password', validate.validatePostForgotPassword, controller.postForgotPassword);

router.get('/verify-otp', JWTAction.checkTokenVerifyOtp, controller.getVerifyOtp);

router.post('/verify-otp', validate.validateVerifyOtp, JWTAction.checkTokenVerifyOtp, controller.postVerifyOtp);

router.get('/reset-password', JWTAction.checkTokenResetPassword, controller.getResetPassword);

router.patch('/reset-password', validate.validateResetPassword, JWTAction.checkTokenResetPassword, controller.patchResetPassword);

module.exports = router;