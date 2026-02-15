import dotenv from "dotenv";
import {S3Client} from "@aws-sdk/client-s3";

dotenv.config();

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;
const AWS_REGION = process.env.AWS_REGION as string;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export default s3;