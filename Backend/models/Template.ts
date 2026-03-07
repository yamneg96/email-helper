import { InferSchemaType, Schema, Types, model } from "mongoose";

const templateSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true },
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

export type TemplateDocument = InferSchemaType<typeof templateSchema>;
export const Template = model("Template", templateSchema);
