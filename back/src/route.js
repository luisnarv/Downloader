const { Router } = require("express");
const ytdl = require("ytdl-core");
const path = require("path");
const fs = require("fs");

// const downloadRouter = require("./download")

const router = Router();

router.use("/download/video", async (req, res) => {
  try {
    const videoId = req.query.url;

    const outputName = "video.mp4";
    const downloadDirectory = "G:/Descargas";
    const outputPath = path.resolve(`${downloadDirectory}/`, outputName);

    const format = ytdl(videoId);

    format.on("info", (info) => {
      console.log("title:", info.videoDetails.title);
      console.log("rating:", info.player_response.videoDetails.averageRating);
      console.log("uploaded by:", info.videoDetails.author.name);
    });

    format.on("progress", (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      console.log("downloading", `${(percent * 100).toFixed(1)}%`);
    });

    format.on("end", () => {
      console.log("saved to", outputName);
    });

    format.pipe(fs.createWriteStream(outputPath));
  } catch (error) {
    console.log(error.message);
  }
});
// router.use("/download/video", async (req, res) => {
//   try {
//     const videoId = req.query.url;

//     const info = await ytdl.getInfo(videoId);

//     const outputName = "video.mp4";
//     const outputPath = path.resolve(__dirname, outputName);

//     const format = ytdl.chooseFormat(info.formats, {
//       quality: "highest",
//     });

//     const videoUrl = format.url;
//     res.redirect(videoUrl);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

router.use("/download/audio", async (req, res) => {
  try {
    console.log(req.query.url);
    const videoId = req.query.url;
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.filterFormats(info.formats, "audioonly", {
      quality: "tiny",
    });

    const videoUrl = format[0].url;
    res.redirect(videoUrl);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
