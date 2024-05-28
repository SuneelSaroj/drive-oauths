const express = require("express");
const fetch = require("node-fetch");
// const { Sequelize, DataTypes } = require("sequelize");
const credential = require("./credential.json");
const cors = require("cors");
const { google } = require("googleapis");
const app = express();
require("dotenv").config();

const viewRouter = require("./routes/viewRouter");
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3002;

app.use(viewRouter);

const client_id = process.env.GOOGLE_OAUTH_CLIENT_ID;
const client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const redirect_uri = credential.web.redirect_uris[0];
const refresh_token = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uri
);

oauth2Client.setCredentials({ refresh_token: refresh_token });

const drive = google.drive({ version: "v3", auth: oauth2Client });

// app.post("/files", async (req, res) => {
//   const data = req.body;
//   const fileId = data[0].id;

//   try {
//     await downloadFile(fileId, res);
//   } catch (error) {
//     console.error("Error:", error);
//     if (!res.headersSent) {
//       res.status(500).send("Error processing file");
//     }
//   }
// });

// async function downloadFile(fileId, res) {
//   try {
//     const fileMetadata = await drive.files.get({
//       fileId: fileId,
//       fields: "mimeType",
//     });
//     const mimeType = fileMetadata.data.mimeType;

//     if (mimeType === "application/vnd.google-apps.document") {
//       await exportFile(fileId, "application/pdf", res);
//     } else {
//       const response = await drive.files.get(
//         { fileId: fileId, alt: "media" },
//         { responseType: "stream" }
//       );
//       response.data
//         .on("end", () => {
//           console.log("Done");
//         })
//         .on("error", (err) => {
//           console.error("Error during download", err);
//           if (!res.headersSent) {
//             res.status(500).send("Error downloading file");
//           }
//         })
//         .pipe(res);
//     }
//   } catch (err) {
//     console.error("Error fetching file from Google Drive:", err);
//     if (!res.headersSent) {
//       res.status(500).send("Error fetching file from Google Drive");
//     }
//   }
// }

// async function exportFile(fileId, mimeType, res) {
//   try {
//     const response = await drive.files.export(
//       { fileId: fileId, mimeType: mimeType },
//       { responseType: "stream" }
//     );
//     response.data
//       .on("end", () => {
//         console.log("Done");
//       })
//       .on("error", (err) => {
//         console.error("Error during export", err);
//         if (!res.headersSent) {
//           res.status(500).send("Error exporting file");
//         }
//       })
//       .pipe(res);
//   } catch (err) {
//     console.error("Error exporting file from Google Drive:", err);
//     if (!res.headersSent) {
//       res.status(500).send("Error exporting file from Google Drive");
//     }
//   }
// }


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
