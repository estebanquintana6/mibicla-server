"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const router = (0, express_1.Router)();
// Load User model
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
// Load utils
const userToJWTPayload_1 = require("../utils/userToJWTPayload");
/**
 * @route POST api/users/register
 * @desc Registers user
 * @params name, last_name, email, telephone, password, code (Campus Code), role (Role name)
 * @access Public
 */
router.post("/register", (req, res) => {
    const { name, last_name, email, telephone, password, } = req.body;
    let { role } = req.body;
    if (!role)
        role = 'USUARIO';
    Role_1.default.findOne({ name: role }).then(role => {
        User_1.default.findOne({ $or: [{ email }, { telephone }] }).populate('role').then(user => {
            if (user) {
                return res.status(400).json({ email: "Ya existe un usuario con ese email o teléfono" });
            }
            else {
                const newUser = new User_1.default({
                    name,
                    last_name,
                    email,
                    password,
                    role: role._id,
                    telephone,
                });
                // Hash password before saving in database
                bcryptjs_1.default.genSalt(10, (err, salt) => {
                    bcryptjs_1.default.hash(newUser.get('password'), salt, (err, hash) => {
                        if (err)
                            throw err;
                        newUser.set('password', hash);
                        User_1.default.create(newUser)
                            .then(user => {
                            return res.json(user);
                        })
                            .catch(err => {
                            console.log('ERR', err);
                            res.status(500);
                        });
                    });
                });
            }
        });
    });
});
/**
 * @route POST api/users/login
 * @desc Retrieves user JWT, so we can store user data by decrypting the JWT in the frontend
 * @params email, password
 * @access Public
 */
router.post("/login", (req, res) => {
    // Form validation
    const { body } = req;
    const { email, password, telephone } = body;
    // Find user by email
    User_1.default.findOne({ $or: [{ email }, { telephone }] }).populate('role').then((user) => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "El email no existe" });
        }
        // Check password
        bcryptjs_1.default.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = (0, userToJWTPayload_1.transformUserToPayload)(user._doc);
                // Sign token
                jsonwebtoken_1.default.sign(payload, config_1.secretKey, {
                    expiresIn: 86400 // 1 year in seconds
                }, (err, token) => {
                    res.json({
                        success: true,
                        token
                    });
                });
            }
            else {
                return res
                    .status(400)
                    .json({ error: "Contraseña incorrecta" });
            }
        });
    });
});
exports.default = router;
