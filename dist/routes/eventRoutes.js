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
const mongoose_1 = require("mongoose");
const Event_1 = __importDefault(require("../models/Event"));
const multer_1 = __importDefault(require("multer"));
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const router = (0, express_1.Router)();
const multerStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        cb(null, `posters/${Date.now()}_${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage: multerStorage
});
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        res.status(404).send("Evento no encontrado");
        return;
    }
    try {
        const event = yield Event_1.default.findById(id);
        if (!event) {
            res.status(404).send("Evento no encontrado");
            return;
        }
        res.status(200).json(event);
    }
    catch (_a) {
        res.status(404).send("Evento no encontrado");
    }
}));
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
router.post("/register", upload.single("poster"), isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, place, date, capacity, distance, price, tags, startLat, startLng, difficulty, time, } = req.body;
    const { filename: posterUrl } = req.file;
    const event = new Event_1.default({
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
        const data = yield event.save();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
exports.default = router;
