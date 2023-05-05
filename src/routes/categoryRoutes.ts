import { Router, Request, Response } from "express";

import multer from "multer";

import Category from "../models/Category";

import isAdminMiddleware from "../middlewares/isAdmin";

const router = Router();
const upload = multer();

/**
 * @route GET /category
 * @desc Get all categories
 * @access Public
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(400).json(err);
    }
})

/**
 * @route POST /category/register
 * @desc Create a new category
 * @params name
 * @access Private
 */
router.post("/register", upload.none(), isAdminMiddleware, async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const category = new Category({
            name
        });
        
        const data = await category.save();

        res.status(200).send(data);

    } catch (err) {
        res.status(500).send("Error en servicio. Intentar más tarde.")
    }

});

/**
 * @route DELETE /events/delete
 * @desc Delte an event by id
 * @params _id
 * @access Private
 */
router.delete("/delete/:id", isAdminMiddleware, async (req: Request, res: Response) => {
    const { params } = req;
    const { id } = params;

    try {
        const category = await Category.findById(id);
        await category.deleteOne();
        res.status(200).send("Categoría eliminada");
    } catch {
        res.status(500).send("Error en servicio. Intentar más tarde.")
    }

});

export default router;
