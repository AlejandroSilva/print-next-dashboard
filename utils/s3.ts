import { PutObjectAclCommandOutput, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'fs'

const REGION = process.env.AWS_REGION
const BUCKET = process.env.S3_BUCKET_NAME

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  },
})

type uploadToBucketResponse = {
  s3Response: PutObjectAclCommandOutput,
  publicUrl: string
}

export const uploadToBucket = (pathToFile: string, s3Key): Promise<uploadToBucketResponse> => {
  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: fs.createReadStream(pathToFile),
  })

  return s3Client.send(uploadCommand)
    .then((s3Response: PutObjectAclCommandOutput) => ({
      s3Response,
      publicUrl: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${s3Key}`
    }))
}
