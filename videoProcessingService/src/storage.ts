// Google cloud storage file interactions
//local file interactions

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName = "climbingRawVideos";
const processedVideoBucketName = "climbingProcessedVideos";

const localRawVideoPath = "./rawVideos";
const localProcessedVideoPath = "./processedVideos";



// creates local directories for raw and processed in
//docker container (organization)

export function setupDirectories() {
    ensureDirectoryExists(localRawVideoPath);
    ensureDirectoryExists(localProcessedVideoPath);
}


/*
parameter rawVideoName name of file to convert from {@link local
rawVideoPath}.
parameter processedVideoName name of file to convert to {@link localProcessedVideoPath}.
returns A promise that resolves when the video has been converted.?
*/
export function convertVideo(rawVideoName: string, processedVideoName: string){
        //first promise
        return new Promise<void>((resolve, reject) => {
            ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf", "scale=-1:360") // turn into 360p
            .on("end", () => {
                console.log("Video processing finished successfully.");
                resolve();
            })
            .on("error", (err) => {
                console.log(`An error occured: ${err.message}`);
                reject(err);
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
        })
}

/**
 * 
 * @param fileName - name of file to download from {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns a promise that resolves when the file has been downloaded.
 */

//in order to use the await keyword wait for that code to finish until bottom -func must be async.
export async function downloadRawVideo(fileName: string){
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({destination: `${localRawVideoPath}/${fileName}`});

    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localProcessedVideoPath}/${fileName}.`)

}
// idea is to keep things as simple as possible for using in other files // if had collaborators as simple as possible for them as well
/**
 * @param fileName - name of file to upload from
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns a promise that resolves when the file successfully upoads
 */
export async function uploadProcessedVideo(fileName: string){
    const bucket = storage.bucket(processedVideoBucketName);
    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });
    console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}`);
    //files in bucket are private by default
    await bucket.file(fileName).makePublic();
}


/**
 * 
 * @param fileName file to be deleted from {@link localRawVideoPath}
 * @returns a promise that resolves when file is deleted
 */
export function deleteRawVideo(fileName: string){
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * 
 * @param fileName file to be deleted from {@link localProcessedVideoPath}
 * @returns a promise that resolves when file is deleted
 */
export function deleteProcessedVideo(fileName: string){
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


/**
 * @param filePath - path of a file to delete
 * @returns a promise that resolves when the file is deleted
 */
function deleteFile(filePath: string): Promise<void>{
    return new Promise((resolve, reject) => {
        if(fs.existsSync(filePath)){
            fs.unlink(filePath, (err) => {
                if (err){
                    console.log(`Failed to delete file at ${filePath}`, JSON.stringify(err));
                    reject(err);
                }else{
                    console.log(`file ${filePath} was successfully deleted`);
                    resolve();
                }
            })
        }else{
            console.log(`File ${filePath} does not exist, not going to delete`);
            resolve();
        }
    });
}

function ensureDirectoryExists(dirPath: string){
    if(!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true}); //recursive true enables nested directories
        console.log(`Directory created at ${dirPath}`);
    }
}





//FUNC

