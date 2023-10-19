import multiparty from "multiparty";
import fs from "fs";
import mime from "mime-types";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

const bucketName = "ecommerce-app";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) reject(err);
      resolve({fields, files});
    });
  });
  
  const client = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: "global",
  });

  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const filename = Date.now() + "." + ext;

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path)
      })
    );
    const link = `https://s3.tebi.io/${bucketName}/${filename}`;
    links.push(link);
  }
  return res.json({links});
}

export const config = {
  api: { bodyParser: false },
};
