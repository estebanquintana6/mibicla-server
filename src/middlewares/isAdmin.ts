import { Request, Response } from "express";

import jwt from "jsonwebtoken";

import { secretKey } from '../config/config';

const isAdmin = (req: Request, res: Response, next: () => void) => {
    const { headers } = req;
    const { authorization } = headers;

    if(!authorization) {
        res.status(401).send("Acceso denegado");
    }

    try {
        const validToken = jwt.verify(authorization, secretKey);

        if (validToken) {
            return next();
        } else {
            res.status(401).send("Acceso denegado");
        }
    } catch(err) {
        res.status(500).send("Fallo en servidor. Intentar más tarde.");
    }
}

export default isAdmin;