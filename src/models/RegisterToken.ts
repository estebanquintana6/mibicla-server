import mongoose from "mongoose";
const { Schema } = mongoose;

// schema
const RegisterTokenSchema = new Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true, 
    }
}, {
  collection: 'RegisterToken'
});

const RegisterToken = mongoose.model('RegisterToken', RegisterTokenSchema);

export default RegisterToken;
