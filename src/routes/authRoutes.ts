import { Router, Request, Response } from "express";

import isAdminMiddleware from "../middlewares/isAdmin";

const router = Router();

/**
 * @route GET /auth
 * @desc Check if an auth token is valid
 * @access Public
 */
router.get("/", isAdminMiddleware, (req: Request, res: Response) => {
    res.status(200).send("Usuario admitido");
});

export default router;
