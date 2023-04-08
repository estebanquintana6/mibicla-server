import { Router, Request, Response } from "express";

import { Types } from "mongoose";

import Event from '../models/Event';

const router = Router();

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
    } catch(err) {
        res.status(400).json(err);
    }
})



/**
 * @route POST /events/register
 * @desc Create a new event
 * @params name, date, capacity, price
 * @access Private
 */
router.post("/register", async (req: Request, res: Response) => {
    const {
        name,
        description,
        place,
        date,
        capacity,
        distance,
        price,
        tags,
    } = req.body;

    const event = new Event({
        name,
        description,
        place,
        date,
        capacity,
        distance,
        price,
        tags,
    });

    try {
        const data = await event.save()
        res.status(200).json(data);
    } catch(err) {
        res.status(400).json(err);
    }
});

export default router;
