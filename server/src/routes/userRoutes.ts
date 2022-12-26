import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { secretKey } from '../config/config';

const router = Router();

// Load User model
import User from "../models/User";
import Role from "../models/Role";

// Load utils
import { transformUserToPayload } from '../utils/userToJWTPayload';


/**
 * @route POST api/users/register
 * @desc Registers user
 * @params name, last_name, email, telephone, password, code (Campus Code), role (Role name)
 * @access Public
 */
router.post("/register", (req: Request, res: Response) => {

    const {
        name,
        last_name,
        email,
        telephone,
        password,
    } = req.body;

    let {
        role
    } = req.body;

    if (!role) role = 'USUARIO';

    Role.findOne({ name: role }).then(role => {
        User.findOne({ $or: [{ email }, { telephone }] }).populate('role').then(user => {
            if (user) {
                return res.status(400).json({ email: "Ya existe un usuario con ese email o teléfono" });
            } else {

                const newUser = new User({
                    name,
                    last_name,
                    email,
                    password,
                    role: role._id,
                    telephone,
                });

                // Hash password before saving in database
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.get('password'), salt, (err, hash) => {
                        if (err) throw err;
                        newUser.set('password', hash);
                        User.create(newUser)
                            .then(user => {
                                return res.json(user)
                            })
                            .catch(err => {
                                console.log('ERR', err);
                                res.status(500)
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
