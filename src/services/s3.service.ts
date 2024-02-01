import { S3 } from "aws-sdk";
import config from "../config/config";
import {uuid} from "uuidv4";



const awsConfig = config.AWS;

const s3Client = new S3({
    params: {
        Bucket: awsConfig.BUCKET_NAME
    },
    credentials: {
        accessKeyId: awsConfig.ACCESS_KEY,
        secretAccessKey: awsConfig.SECRET_KEY
    },
    region: awsConfig.REGION,
});


const presignedUpload = async (fileName: string, fileType: string, path: string): Promise<{ method: string; url: string; key: string; }> => {
    
    fileName = fileName.replace(
        // eslint-disable-next-line no-useless-escape
        /[^0-9a-z\.\-\_]+/gi,
        "_",
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
        ContentType: fileType,
        Key: `${path}/${uuid()}-${fileName.split("/").pop()}`,
        Expires: 600,
    };
    
    const url = await s3Client.getSignedUrlPromise(
        "putObject",
        params);
    return { method: "PUT", url, key: params.Key };
};


export default {
    presignedUpload,
};