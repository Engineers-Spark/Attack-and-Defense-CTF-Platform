import mongoose, { Schema } from "mongoose"

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// We'll handle password hashing in the login route instead of here
// This avoids issues with the pre-save hook not working correctly

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema)
