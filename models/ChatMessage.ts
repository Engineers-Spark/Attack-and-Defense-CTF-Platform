import mongoose, { Schema } from "mongoose"

const ChatMessageSchema = new Schema(
  {
    nickname: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    teamName: {
      type: String,
      required: true,
      ref: "Team",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", ChatMessageSchema)
