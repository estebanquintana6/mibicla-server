import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
