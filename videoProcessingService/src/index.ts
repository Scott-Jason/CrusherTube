import express from "express";
import ffmpeg from "fluent-ffmpeg";


const app = express();
app.use(express.json());



app.post("/process-video", (req, res) => {
    //get path of input video file from request body 
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if(!inputFilePath || !outputFilePath){
        res.status(400).send("Bad request: missing filepaths input or output filepath");
    }
    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") // turn into 360p
        .on("end", () => {

            res.status(200).send("Video processing finished successfully.");

        })
        .on("error", (err) => {
            console.log(`An error occured: ${err.message}`);
            res.status(500).send(`Internal server rror: ${err.message}`);
        })
        .save(outputFilePath);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video process service listening at http://localhost:${port}`);
});