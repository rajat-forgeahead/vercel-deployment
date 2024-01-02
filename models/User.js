import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpiry:{
      type: Date,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    image: {
      type: String, // Assuming storing the image path as a string
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.User || mongoose.model("User", userSchema);
