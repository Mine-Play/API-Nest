import { Injectable } from '@nestjs/common';
import * as AWS from "aws-sdk";

@Injectable()
export class StorageService
{
    S3_BUCKET = process.env.S3_BUCKET;
    s3 = new AWS.S3
    ({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT
    });

    async upload(file, path, name): Promise<string | boolean>
    {
        return await this.s3_upload(file.buffer, this.S3_BUCKET, path, name, file.mimetype);
    }
    get(path){
        return process.env.S3_URL + `${path}`
    }
    async s3_upload(file, bucket, path, name, mimetype): Promise<string | boolean>
    {
        const params = 
        {
            Bucket: `${bucket}${path}`,
            Key: String(name),
            Body: file,
            ACL: "public-read",
            ContentType: mimetype,
            ContentDisposition:"inline",
            CreateBucketConfiguration: 
            {
                LocationConstraint: "ap-south-1"
            }
        };

        try
        {
            this.s3.upload(params).promise();
            return this.get(`${path}/${name}`);
        }
        catch (e)
        {
            console.log(e);
            return false;
        }
    }
}