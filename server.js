import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(express.json());

  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage", async (req, res) => {
    const { image_url } = req.query;

    if (!image_url) {
      return res.status(400).send({ message: "image_url query parameter is required." });
    }

    try {
      console.log(`\n[Server] Processing image URL: ${image_url}`);
      
      // Call filterImageFromURL to download and filter the image
      const filteredPath = await filterImageFromURL(image_url);
      
      // Get just the filename (e.g., "filtered.874.jpg") out of the path
      const filename = path.basename(filteredPath);
      console.log(`[Server] File created successfully: ${filename}. Sending to browser...`);

      // WINDOWS FIX: Send file using a relative name combined with the current working directory root
      res.status(200).sendFile(filename, { root: process.cwd() }, async (err) => {
        if (err) {
          console.error("[Server] Express sendFile error:", err);
          return res.status(500).send({ message: "Failed to send the processed image." });
        }
        
        console.log(`[Server] File sent successfully! Cleaning up local file: ${filename}`);
        // Delete temporary local files on completion of the response
        await deleteLocalFiles([filteredPath]);
      });

    } catch (error) {
      console.error("[Server] Caught error during processing:", error);
      return res.status(422).send({ 
        message: "Unable to process the image. Ensure the URL points to a valid, public image file." 
      });
    }
  });
  
  // Root Endpoint
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  // Start the Server
  app.listen(port, () => {
      console.log(`server running http://localhost:${port}`);
      console.log(`press CTRL+C to stop server`);
  });
})();