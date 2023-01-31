"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const validator_1 = require("../utils/validator");
const passwordUtils_1 = require("../utils/passwordUtils");
const router = (0, express_1.Router)();
// Load User model
const User_1 = __importDefault(require("../models/User"));
// Load utils
const userToJWTPayload_1 = require("../utils/userToJWTPayload");
/**
 * @route POST /users/register
 * @desc Registers user
 * @params name, last_name, email, telephone, password, code (Campus Code), role (Role name)
 * @access Public
 */
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, } = req.body;
    const validPassword = (0, validator_1.validatePassword)(password);
    const validEmail = (0, validator_1.validateEmail)(email);
    const validName = (0, validator_1.validateName)(name);
    if (!validPassword || !validEmail || !validName) {
        res.status(400).json({
            error: "Datos faltantes o incorrectos"
        });
        return;
    }
    const userExist = yield User_1.default.findOne({ email });
    if (userExist) {
        res.status(400).json({
            error: "Ya hay un usuario registrado con este correo"
        });
        return;
    }
    try {
        const hashedPassword = yield (0, passwordUtils_1.hashPassword)(password);
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword
        });
        const newUser = yield user.save();
        res.status(200).json(newUser);
    }
    catch (err) {
        res.status(500).json({
            error: "Error en servidor"
        });
    }
    return;
}));
/**
 * @route POST /users/login
 * @desc Retrieves user JWT, so we can store user data by decrypting the JWT in the frontend
 * @params email, password
 * @access Public
 */
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    ;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        res.status(400).json({
            error: "Datos incorrectos"
        });
        return;
    }
    const isMatchingPassword = yield (0, passwordUtils_1.verifyPassword)(password, user.password);
    if (isMatchingPassword) {
        const payload = (0, userToJWTPayload_1.transformUserToPayload)(user.toObject());
        jsonwebtoken_1.default.sign(payload, config_1.secretKey, {
            expiresIn: 86400
        }, (err, token) => {
            res.status(200).json({
                success: true,
                token
            });
        });
        return;
    }
    else {
        res.status(400).json({ error: "Datos incorrectos" });
        return;
    }
}));
exports.default = router;
