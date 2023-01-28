"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Event_1 = __importDefault(require("../models/Event"));
const router = (0, express_1.Router)();
/**
 * @route GET /events
 * @desc Get all events
 * @access Public
 */
router.get("/", (req, res) => {
    Event_1.default.find().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(400).json(err);
    });
});
/**
 * @route POST /events/register
 * @desc Create a new event
 * @params name, date, capacity, price
 * @access Private
 */
router.post("/register", (req, res) => {
    const { name, description, date, capacity, price } = req.body;
    const event = new Event_1.default({
        name,
        description,
        date,
        capacity,
        price
    });
    event.save().then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(400).json(err);
    });
});
exports.default = router;
