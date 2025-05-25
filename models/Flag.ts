import mongoose, { Schema } from "mongoose"

const FlagSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: String,
      required: true,
      ref: "Team",
    },
    // Instead of a simple boolean, track which teams have submitted this flag
    submissions: [
      {
        team: {
          type: String,
          ref: "Team",
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Flag || mongoose.model("Flag", FlagSchema)
