import { Router, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { secretKey } from '../config/config';

import User from "../models/User";

const router = Router();


/**
 * @route GET /auth
 * @desc Check if an auth token is valid
 * @access Public
 */

router.get("/", async (req: Request, res: Response) => {
    const { headers } = req;
    const { authorization } = headers;
    jwt.verify(authorization, secretKey, async (err, { _id } : any) => {
        if (err) {
            res.status(401).send("Acceso denegado");
            return;
        }

        const user = User.findById(_id);

        if (!user) {
            res.status(401).send("Acceso denegado");
            return;
        }

        res.status(200).send("Usuario admitido");
    });
});

export default router;
