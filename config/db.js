
const mongoose = require("mongoose");
require("dotenv").config();

const db = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    // Removed deprecated options: useNewUrlParser and useUnifiedTopology
    await mongoose.connect(db);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

