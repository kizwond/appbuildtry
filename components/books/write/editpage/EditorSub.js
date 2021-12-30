import FroalaEditor from "../../../../node_modules/wysiwyg-editor-node-sdk/lib/s3"

const s3config = {
  // The name of your bucket.
  bucket: process.env.NEXT_PUBLIC_S3_BUCKET_IMAGEINCARD,

  // S3 region. If you are using the default us-east-1, it this can be ignored.
  region: process.env.NEXT_PUBLIC_S3_REGION,
  // The folder where to upload the images.
  keyStart: "original/",

  // File access.
  acl: "public-read",

  // AWS keys.
  accessKey: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
  secretKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
};


export const s3Hash = FroalaEditor.S3.getHash(s3config);
console.log(s3Hash)