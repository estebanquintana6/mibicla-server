import { Router, Request, Response } from "express";

import Event from '../models/Event';

const router = Router();

/**
 * @route GET /events
 * @desc Get all events
 * @access Public
 */
router.get("/", (req: Request, res: Response) => {
    Event.find().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(400).json(err);
    })
})



/**
 * @route POST /events/register
 * @desc Create a new event
 * @params name, date, capacity, price
 * @access Private
 */
router.post("/register", (req: Request, res: Response) => {
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

    event.save().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(400).json(err);
    });

});

export default router;
