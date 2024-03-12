const { Router } = require("express");
const ytdl = require("ytdl-core");
const path = require("path");
const fs = require("fs");

// const downloadRouter = require("./download")

const router = Router();

//Enviar el video al front end
router.use("/download/video", async (req, res) => {
  try {
    //Obtenemos la URL del video por query
    const videoId = req.query.url;
    //Buscamos la información del video y filtramos por audio y video
    const info = await ytdl.getInfo(videoId);
    // const format = ytdl.filterFormats(info.formats, "videoandaudio");
    const format = ytdl.chooseFormat(info.formats, {
      filter: (format) => format.container === "videoandaudio",
    });

    res.set("Content-Type", "video/mp4");
    // format.pipe(res);
    console.log(format);
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

//formato devuelto es ,audio/ mp4 y webbm cambiar el formato antes de anviar al front
router.use("/download/audio", async (req, res) => {
  try {
    const videoId = req.query.url;
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.filterFormats(info.formats, "audioonly");

    res.set("Content-Type", "audio/mp3");
    // Establecer el encabezado Content-Disposition para indicar el nombre del archivo
    res.set("Content-Disposition", `attachment; filename=${info.title}.mp3`);

    let videoUrl;
    let index = 0;
    for (let url of format) {
      if (url.mimeType.includes("mp4")) {
        videoUrl = format[index].url;
      }
      index++;
    }
    // const videoUrl = format[0].url;
    res.send(videoUrl);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
