import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import csrf from "csurf";
import rateLimit from "express-rate-limit";


import userRoute from "./user/route/route";
import adminRoute from "./admin/route/routes";

dotenv.config(); // Load environment variables at the very beginning

const app = express();

const csrfProtection = csrf({ cookie: true });


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("../public"));
app.use(express.json());
app.use(
  cors({
    // origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:5000", "http://localhost:3000", "http://localhost:8000", "https://www.providers.theraswift.co", "https://www.theraswift.co", "https://theraswift.co"],
    origin: "*",
    credentials: true
  })
);
app.use(helmet());

// Database connection
// const MONGODB_URI = "mongodb://localhost:27017/TheraSwiftLocal";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('The MONGODB_URI environment variable is not set.');
}

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Connected To Database - Initial Connection");
  } catch (err) {
    console.log(
      `Initial Distribution API Database connection error occurred -`,
      err
    );
  }
})();

// Router middleware
app.use(
  "/",
  express.Router().get("/", (req, res) => {
    res.json("Hello");
  })
);

app.use("/user", userRoute);
app.use("/admin", adminRoute);


// App initialized port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
