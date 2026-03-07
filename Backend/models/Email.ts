import { InferSchemaType, Schema, Types, model } from "mongoose";

const attachmentSchema = new Schema(
  {
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false },
);

const emailSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    attachments: { type: [attachmentSchema], default: [] },
    status: {
      type: String,
      enum: ["sent", "received"],
      required: true,
    },
    messageId: { type: String },
    threadId: { type: String },
    language: {
      type: String,
      enum: ["en", "am"],
      default: "en",
    },
  },
  {
    timestamps: true,
  },
);

export type EmailDocument = InferSchemaType<typeof emailSchema>;
export const Email = model("Email", emailSchema);
