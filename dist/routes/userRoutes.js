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
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const validator_1 = require("../utils/validator");
const passwordUtils_1 = require("../utils/passwordUtils");
const router = (0, express_1.Router)();
const User_1 = __importDefault(require("../models/User"));
const RegisterToken_1 = __importDefault(require("../models/RegisterToken"));
// Load utils
const userToJWTPayload_1 = require("../utils/userToJWTPayload");
/**
 * @route GET /users
 * @desc Send Admin Invitation user
 * @params email
 * @access Private
 */
router.get("/", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({}).select(["-password"]);
        res.status(200).send(users);
    }
    catch (_a) {
        res.status(500).send("Error en servicio. Intentar más tarde.");
    }
}));
/**
 * @route POST /users/register
 * @desc Registers user
 * @params name, last_name, email, telephone, password, code (Campus Code), role (Role name)
 * @access Public
 */
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, register_token, } = req.body;
    const registerToken = yield RegisterToken_1.default.findById(register_token);
    if (!registerToken) {
        res.status(400).json({
            error: "Datos faltantes o incorrectos"
        });
        return;
    }
    const { email } = registerToken;
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
        yield registerToken.delete();
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
/**
 * @route POST /users/validate_register_invitation
 * @desc Validate register token
 * @params token
 * @access Public
 */
router.get("/validate_register_invitation/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    // http://localhost:3000/admin/registro/123
    try {
        const registerToken = yield RegisterToken_1.default.findById(token);
        if (!registerToken) {
            res.status(404).send("Token no valido.");
            return;
        }
        res.status(200).send(registerToken.email);
        return;
    }
    catch (err) {
        res.status(404).send("Token no valido.");
    }
}));
/**
 * @route POST /users/send_register_invitation
 * @desc Send Admin Invitation user
 * @params email
 * @access Private
 */
router.post("/send_register_invitation", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).send("Faltan datos en la petición");
    }
    try {
        new RegisterToken_1.default({ email }).save();
        res.status(200).send("Invitación de registro creada");
    }
    catch (_b) {
        res.status(500).send("Error en servicio, intentar más tarde.");
        return;
    }
}));
exports.default = router;
