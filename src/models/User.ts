import mongoose from "mongoose";
const { Schema } = mongoose;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "ADMIN",
  },
  created_at: {
    type: Date,
    default: Date.now
  },
});

const Users = mongoose.model('Users', UserSchema);

export default Users;
