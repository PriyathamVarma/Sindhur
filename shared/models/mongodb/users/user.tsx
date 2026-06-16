import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    authProvider: { type: String, enum: ["credentials", "google"], default: "credentials" },
    supabaseUserId: { type: String, index: true },
    avatarUrl:    { type: String },
    role:         { type: String, enum: ["Admin"], default: "Admin" },
  },
  { timestamps: true },
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
