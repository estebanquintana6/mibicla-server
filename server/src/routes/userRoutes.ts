import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { secretKey } from '../config/config';

import {
    validateName,
    validatePassword,
    validateEmail
} from "../utils/validator";

import { hashPassword, verifyPassword } from "../utils/passwordUtils"

const router = Router();

// Load User model
import User from "../models/User";

// Load utils
import { transformUserToPayload } from '../utils/userToJWTPayload';

/**
 * @route POST /users/register
 * @desc Registers user
 * @params name, last_name, email, telephone, password, code (Campus Code), role (Role name)
 * @access Public
 */
router.post("/register", async (req: Request, res: Response) => {

    const {
        name,
        email,
        password,
    } = req.body;

    const validPassword = validatePassword(password);
    const validEmail = validateEmail(email);
    const validName = validateName(name);

    if(validPassword && validEmail && validName) {
        const userExist = await User.findOne({ email });
        
        if(userExist) {
            res.status(400).json({
                error: "Ya hay un usuario registrado con este correo"
            });
            return;
        }
        try {
            const hashedPassword = await hashPassword(password);
            const user = new User({
                name,
                email,
                password: hashedPassword
            })
            const newUser = await user.save();
            res.status(200).send(newUser);
        } catch(err) {
            res.status(500).send({
                error: "Error en servidor"
            });
        }
        return;
    } else {
        res.status(400).json({
            error: "Datos faltantes o incorrectos"
        })
        return;
    }
});

/**
 * @route POST api/users/login
 * @desc Retrieves user JWT, so we can store user data by decrypting the JWT in the frontend
 * @params email, password
 * @access Public
 */
router.post("/login", (req: Request, res: Response) => {
    // Form validation
    const { body } = req;

    const { email, password, telephone } = body;

    // Find user by email
    User.findOne({ $or: [{ email }, { telephone }] }).populate('role').then((user: any) => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "El email no existe" });
        }
        // Check password
        bcrypt.compare(password, user.password).then((isMatch: boolean) => {
            if (isMatch) {
                // User matched

                // Create JWT Payload
                const payload = transformUserToPayload(user._doc)

                // Sign token
                jwt.sign(payload, secretKey,
                    {
                        expiresIn: 86400 // 1 year in seconds
                    },
                    (err: Error, token: string) => {
                        res.json({
                            success: true,
                            token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ error: "Contraseña incorrecta" });
            }
        });
    });
});

export default router;
