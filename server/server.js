require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const MONGO_URL = require("./config");

const { userRouter } = require("./routes/users");
const { courseRouter } = require("./routes/courses");

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (res) => {
  res.sendFile(__dirname + "/src/App.jsx");
});
app.use("/user", userRouter);
app.use("/course", courseRouter);

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    app.listen(5000, () => {
      console.log("Server listening on port 5000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit process with failure
  }
}
main();
