import { google }  from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// const auth = new google.auth.GoogleAuth({
//     keyFile: "google-sheet-credential.json",
//     scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
//     // scopes: "https://www.googleapis.com/auth/spreadsheets",
// });

// export const sheets = google.sheets({ version: "v4", auth });

const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({ version: "v4", auth });