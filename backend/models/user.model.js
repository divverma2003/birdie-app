import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model (16 characters)
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model (16 characters)
        ref: "User",
        default: [],
      },
    ],
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (inputPassword) {
  try {
    return await bcrypt.compare(inputPassword, this.password);
  } catch (error) {
    throw new Error(
      "Error in comparePassword [UserModel], password comparison failed."
    );
  }
};
export const User = mongoose.model("User", userSchema);
