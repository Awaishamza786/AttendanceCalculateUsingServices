const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const router = require("./Router/index");
require("./config/mongodb_connection");

app.get("/api", (req, res) => {
  res.send("server is listening.... hello 12345");
});
app.use("/", router);
let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
