"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const EventsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    capacity: {
        type: Number,
        required: false
    },
    distance: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        default: 0,
        required: false
    },
    tags: {
        type: [String],
        default: [],
        required: false,
    }
}, {
    collection: 'Events'
});
const Event = mongoose_1.default.model('Events', EventsSchema);
exports.default = Event;
