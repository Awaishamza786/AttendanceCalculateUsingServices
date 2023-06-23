const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const router=require('./Router/index')
require('./config/mongodb_connection')

app.use('/',router)
let Port = 8080;
app.listen(Port, () => {
  console.log(`Server started on port ${Port}`);
});
