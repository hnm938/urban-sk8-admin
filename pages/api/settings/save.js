import { Settings } from "@/models/Setting";

const { mongooseConnect } = require("@/lib/mongoose");

export default async function handler(req, res) {
  await mongooseConnect();

  const { _id, featuredProduct } = req.body;
  console.log(featuredProduct);
  
  await Settings.updateOne(
    { _id },
    { featuredProduct }
  );

  res.json(true);
}