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

import User from "../models/User";
import RegisterToken from "../models/RegisterToken";

// Load utils
import { transformUserToPayload } from '../utils/userToJWTPayload';


router.post("/send_register_invitation", async (req: Request, res: Response) => {
    const { headers } = req;
    const { authorization } = headers;
    
    if (!authorization) {
        res.status(401).send("Acceso denegado");
        return;
    }

    const { email } = req.body;

    if( !email ) {
        res.status(400).send("Faltan datos en la petición");
    }

    jwt.verify(authorization, secretKey, async (err, { _id } : any) => {
        if (err) {
            res.status(401).send("Acceso denegado");
            return;
        }
        
        const user = await User.findById(_id);

        if (!user || user.role !== 'SUPER_ADMIN') {
            res.status(401).send("Acceso denegado");
            return;
        }

        try {
            new RegisterToken({ email }).save();
            res.status(200).send("Invitación de registro creada");
        } catch {
            res.status(500).send("Error en servicio, intentar más tarde.");
            return;
        }
    });

});

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

    if (!validPassword || !validEmail || !validName) {
        res.status(400).json({
            error: "Datos faltantes o incorrectos"
        })
        return;
    }

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
        res.status(200).json(newUser);
    } catch(err) {
        res.status(500).json({
            error: "Error en servidor"
        });
    }
    return;
});

/**
 * @route POST /users/login
 * @desc Retrieves user JWT, so we can store user data by decrypting the JWT in the frontend
 * @params email, password
 * @access Public
 */
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(400).json({
            error: "Datos incorrectos"
        })
        return;
    }

    const isMatchingPassword = await verifyPassword(password, user.password);

    if (isMatchingPassword) {
        const payload = transformUserToPayload(user.toObject());

        jwt.sign(payload, secretKey,
            {
                expiresIn: 86400
            },
            (err: Error, token: string) => {
                res.status(200).json({
                    success: true,
                    token
                });
            }
        );
        return;
    } else {
        res.status(400).json({ error: "Datos incorrectos" });
        return;
    }
});

export default router;
