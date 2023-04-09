import mongoose from "mongoose";
const { Schema } = mongoose;

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
  time: {
    type: String,
    required: true,
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
  },
  difficulty: {
    type: String,
    enum: ["Entusiasta", "Principiante", "Intermedio", "Avanzado"],
    required: true
  },
  startLat: {
    type: Number,
    required: true,
  },
  startLng: {
    type: Number,
    required: true
  },
  posterUrl: {
    type: String,
    required: true
  }
}, {
  collection: 'Events'
});

const Event = mongoose.model('Events', EventsSchema);

export default Event;
