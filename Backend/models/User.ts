import bcrypt from "bcryptjs";
import { HydratedDocument, Model, Schema, model } from "mongoose";

export type SupportedLanguage = "en" | "am";
export type ThemeMode = "light" | "dark" | "system";

interface OnboardingProgress {
  step: number;
  completed: boolean;
}

export interface GmailTokens {
  accessToken?: string;
  refreshToken?: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  language: SupportedLanguage;
  theme: ThemeMode;
  onboarding: OnboardingProgress;
  gmailTokens?: GmailTokens;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModelType = Model<IUser, object, IUserMethods>;
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    language: {
      type: String,
      enum: ["en", "am"],
      default: "en",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    onboarding: {
      step: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
    },
    gmailTokens: {
      accessToken: { type: String },
      refreshToken: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser, UserModelType>("User", userSchema);
