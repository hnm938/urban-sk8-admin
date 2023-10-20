import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  await mongooseConnect();

  // Delete image from database
  if (req.method === "PUT") {
    try {
      const { link } = req.body;

      // #region Delete image from bucket
      const bucketParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: link.toString().split("/")[link.toString().split("/").length - 1],
      };

      const client = new S3Client({
        endpoint: "https://s3.tebi.io",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: "global",
      });

      try {
        const data = await client.send(new DeleteObjectCommand(bucketParams));
        console.log("Image deleted successfully.", data);
      } catch (error) {
        console.error("Error deleting image.", error);
      }
      // #endregion

      // #region Delete image from database
      const product = await Product.findOne({ images: link });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const imageIndex = product.images.indexOf(link);

      if (imageIndex === -1) {
        return res.status(404).json({ error: "Image not found in product" });
      }

      if (product.images.length === 1) {
        product.images = [];
      } else {
        product.images.splice(imageIndex, 1);
      }

      await product.save();
      // #endregion

      return res.status(200).json({ message: "Image removed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
