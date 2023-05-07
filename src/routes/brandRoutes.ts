import { Router, Request, Response } from "express";

import multer from "multer";

import Brand from "../models/Brand";

import isAdminMiddleware from "../middlewares/isAdmin";

const router = Router();
const upload = multer();

/**
 * @route GET /brands
 * @desc Get all brands
 * @access Public
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const categories = await Brand.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json(err);
    }
})

/**
 * @route POST /brands/register
 * @desc Create a new category
 * @params name
 * @access Private
 */
router.post("/register", upload.none(), isAdminMiddleware, async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const brand = new Brand({
            name
        });
        
        const data = await brand.save();

        res.status(200).send(data);

    } catch (err) {
        res.status(500).send("Error en servicio. Intentar más tarde.")
    }

});

/**
 * @route DELETE /brands/delete
 * @desc Delte an event by id
 * @params _id
 * @access Private
 */
router.delete("/delete/:id", isAdminMiddleware, async (req: Request, res: Response) => {
    const { params } = req;
    const { id } = params;

    try {
        const brand = await Brand.findById(id);
        await brand.deleteOne();
        res.status(200).send("Marca eliminada");
    } catch {
        res.status(500).send("Error en servicio. Intentar más tarde.")
    }

});

export default router;
