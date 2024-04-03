import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  type: {
    type: String,
  },
  address: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  mobileNumber: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  this.set({ createdAt: new Date() });
  this.set({ updatedAt: new Date() });
  this.set({ type: "STANDARD"})
  next();
})

UserSchema.pre("update", async function (next) {
  this.set({ updatedAt: new Date() });
  next();
});


export const UserModel = mongoose.model("User", UserSchema);
