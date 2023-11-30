const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

const DB =
  "mongodb://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASSWORD +
  "@mongodb:27017/myDatabase?authSource=admin";

mongoose
  .connect(DB)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.log(err);
  });

//server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${server.address().port}`);
});
