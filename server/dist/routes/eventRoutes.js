"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event_1.default.find();
        res.status(200).json(events);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
/**
 * @route POST /events/register
 * @desc Create a new event
 * @params name, date, capacity, price
 * @access Private
 */
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, place, date, capacity, distance, price, tags, } = req.body;
    const event = new Event_1.default({
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
        const data = yield event.save();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
exports.default = router;
