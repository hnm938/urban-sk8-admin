import mongoose, { model, models, Schema } from "mongoose";

const SettingsSchema = new Schema(
  {
    featuredProduct: String,
  },
  {
    timestamps: true,
  }
);

export const Settings = models?.Settings || model("Settings", SettingsSchema);
