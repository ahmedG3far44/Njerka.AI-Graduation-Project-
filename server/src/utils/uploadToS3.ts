import {PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3/dist-types";
import s3 from "../config/s3";
import dotenv from "dotenv";

dotenv.config();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME as string || "ngirka-ai";
const AWS_BUCKET_DOMAIN = process.env.AWS_BUCKET_DOMAIN as string || "https://ngirka-ai.s3.amazonaws.com";


export interface FilesType {
    name?: string;
    originalname?: string;
    encoding?: string;
    size?: number;
    data?: Buffer;
    mimetype?: string;
}

export async function uploadImage(file : FilesType) {
    if (!file) {
        return {success: false, url: null}
    }

    let key = "./uploads/" + Date.now().toString() + file.mimetype;

    const commnad = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: "public-read"
    });

    let url = `${AWS_BUCKET_DOMAIN}/${key}`
    
    s3.send(commnad).then((data) => {
        console.log(data)
        console.log("image uploaded successfully")
        return {success: true, url: url}
    }).catch((error) => {
        console.log(error, "failed to upload image")
        return {success: false, url: null}

    });

}


export async function deleteFile(key : string) {
    
    if(!key) {
        return {success: false, message: "no key provided"}
    }

    const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    })
    
    s3.send(deleteCommand).then((data) => {
        console.log(data)
        console.log("image deleted successfully")
        return {success: true, message: "image deleted successfully"}
    }).catch((error) => {
        console.log(error, "failed to delete image")
        return {success: false, message: "failed to delete image"}
    })
}
