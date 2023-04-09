import { Router, Request, Response } from "express";

import { Types } from "mongoose";

import Event from '../models/Event';

import multer from "multer";

const router = Router();

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        cb(null, `posters/${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({
    storage: multerStorage
});

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        res.status(404).send("Evento no encontrado");
        return;
    }

    try {
        const event = await Event.findById(id);

        if (!event) {
            res.status(404).send("Evento no encontrado");
            return;
        }

        res.status(200).json(event);
    } catch {
        res.status(404).send("Evento no encontrado");
    }
});

/**
 * @route GET /events
 * @desc Get all events
 * @access Public
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(400).json(err);
    }
})



/**
 * @route POST /events/register
 * @desc Create a new event
 * @params name, date, capacity, price
 * @access Private
 */
router.post("/register", upload.single("poster"), async (req: Request, res: Response) => {
    const {
        name,
        description,
        place,
        date,
        capacity,
        distance,
        price,
        tags,
        startLat,
        startLng,
        difficulty,
        time,
    } = req.body;

    const { filename: posterUrl } = req.file;

    console.log(req.file);

    const event = new Event({
        name,
        description,
        place,
        date,
        capacity,
        distance,
        price,
        tags,
        time,
        startLat,
        startLng,
        difficulty,
        posterUrl
    });

    try {
        const data = await event.save()
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
});

export default router;
