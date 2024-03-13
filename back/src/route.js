const { Router } = require("express");
const ytdl = require("ytdl-core");
const { exec } = require("child_process");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const path = require("path");

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
    //console.log(info.author.name, "esto es info");
    const format = ytdl.filterFormats(info.formats, "audioonly");

    // Establecer la ruta de ffmpeg
    ffmpeg.setFfmpegPath(ffmpegPath);

    // Convertir el formato de audio M4A a MP3 usando ffmpeg
    const inputFilePath = "input.m4a";
    const outputFilePath = "output.mp3";
    const ffmpegCommand = `ffmpeg -i ${format[0].url} -acodec libmp3lame ${outputFilePath}`;
    let videoUrl;
    let index = 0;
    for (let url of format) {
      if (url.mimeType.includes("mp4")) {
        videoUrl = format[index].url;
      }
      index++;
    }
    ffmpeg()
      .input(videoUrl)
      .output("output.mp3")
      .on("end", () => {
        res.set("Content-Type", "audio/mp3");
        res.set(
          "Content-Disposition",
          `attachment; filename=${info.title}.mp3`
        );
        console.log("Conversión completada");
        res.download("output.mp3"); // Enviar el archivo como respuesta HTTP
      })
      .on("error", (err) => {
        console.error("Error en la conversión:", err);
        res.status(500).send("Error en la conversión");
      })
      .run();

    // Establecer el encabezado Content-Disposition para indicar el nombre del archivo

    // let videoUrl;
    // let index = 0;
    // for (let url of format) {
    //   if (url.mimeType.includes("mp4")) {
    //     videoUrl = format[index].url;
    //   }
    //   index++;
    // }

    // res.send(videoUrl);
  } catch (error) {
    console.log("error en el back", error.message);
  }
});

module.exports = router;
