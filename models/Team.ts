import mongoose, { Schema } from "mongoose"

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    flags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Team || mongoose.model("Team", TeamSchema)
