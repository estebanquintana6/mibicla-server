import mongoose from "mongoose";
const { Schema } = mongoose;

const brandSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
      unique: true
    }
  }, { timestamps: true });
  
  const Brand = mongoose.model('Brand', brandSchema);

  export default Brand;