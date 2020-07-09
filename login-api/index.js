const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", require("./routes/Auth.js"));

app.listen(5000);
