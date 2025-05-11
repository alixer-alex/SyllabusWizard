
import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

Amplify.configure(awsmobile)

export const uploadFileToS3File = async (bucketName: string, key: string, fileContent: Blob) => {
  
  const s3Client = new S3Client({region: 'us-west-2',credentials: creds, requestChecksumCalculation:"WHEN_REQUIRED"});


  // Set upload parameters
  const params = {
    Body: fileContent,
    Bucket: bucketName,
    Key: key,
    
  };
  
  console.log(fileContent instanceof Blob)
  try {
    // Upload file to S3
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    console.log("File uploaded successfully", response);
  } catch (error) {
    console.error("Error uploading file", error);
  }
};

