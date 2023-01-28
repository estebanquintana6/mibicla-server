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

const Event = mongoose.model('Events', EventsSchema);

export default Event;
