import fs from "fs";
import Jimp from "jimp";
import axios from "axios";
import path from "path";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      // Download the image as a buffer with a User-Agent header to prevent Wikimedia blocking
      const response = await axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });

      // Pass the downloaded buffer directly into Jimp
      const photo = await Jimp.read(Buffer.from(response.data));
      
      // WINDOWS ABSOLUTE PATH FIX: Generates a full absolute path for Express res.sendFile
      const filename = "filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      const outpath = path.resolve(filename);
        
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(outpath); // Returns the clean absolute path
          }
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
export async function deleteLocalFiles(files) {
  for (let file of files) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}