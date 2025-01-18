import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";

setupDirectories();

const app = express();
app.use(express.json());

//process a video file from cloud storage into 360p
app.post("/process-video", async (req, res) => {
    //Get the bucket and filename from the Cloud pub/sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if(!data.name){
            throw new Error('Invalid message payload recieved');
        }
    }catch(error){
        console.error(error);
        return res.status(400).send('Bad request: missing filename');
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    //Download raw video from Cloud storage
    await downloadRawVideo(inputFileName);
    
    //convert video to 360p
    try {
        await convertVideo(inputFileName, outputFileName);
    }catch (err) {
        //await in parallel promise.all takes an array of promises
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        
        console.error(err);
        return res.status(500).send('Internal server error: video processing failed');
    }

    //Upload the processed video to cloud storage
    await uploadProcessedVideo(outputFileName)
    //dup code becuase deleting files if there was an error vs success
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);
    return res.status(200).send('Processing finished successfully');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video process service listening at http://localhost:${port}`);
}); 