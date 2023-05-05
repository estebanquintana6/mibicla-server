import mongoose from "mongoose";
const { Schema } = mongoose;

// Category schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
    unique: true
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;