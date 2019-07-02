const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const urlHandler = require("./controllers/urlHandler");
const bodyParser = require("body-parser");

mongoose.connect(
  "mongodb+srv://purplecandy:" +
    process.env.MONGO_PASS +
    "@fcc-d0fuw.mongodb.net/shortenurl?retryWrites=true&w=majority",
  { useMongoClient: true }
);
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));
app.post("/api/shorturl/new", urlHandler.createUrl);
app.get("/:shurl", urlHandler.getLongUrl);

app.use(function(req, res) {
  return res
    .status(404)
    .type("txt")
    .send("Not Found");
});
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => console.log("Started listening at", port));
