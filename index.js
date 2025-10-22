const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const { restrictLoggedinUserOnly, checkAuth } = require("./middleware/auth");
const URL = require("./models/url");
require("dotenv").config();


const app = express();
const PORT = 8001;

// Connect to MongoDB Atlas
const mongo_url = process.env.MONGO_ATLAS_URL;
// console.log("🔍 MONGO_ATLAS_URL =", process.env.MONGO_ATLAS_URL);


connectToMongoDB(mongo_url)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("MongoDB Error:", err));

// Create MongoDB-backed session store
const store = MongoStore.create({
  mongoUrl: mongo_url,
  crypto: {
    secret: process.env.MONGO_CRYPTO_SECRET,
  },
  touchAfter: 24 * 3600,
});

// Session middleware
app.use(session({
  secret: 'foo',
  resave: false,
  saveUninitialized: false,
  store: store,   // ✅ Correct usage
}));

// Middleware & view engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

app.use("/url", restrictLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

// Redirect logic
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: { visitHistory: { timestamp: Date.now() } },
    }
  );
  res.redirect(entry.redirectUrl);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
