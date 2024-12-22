const mongoose = require("mongoose");
require("dotenv").config();

function connectToMongoDB() {
  const connectWithRetry = () => {
    mongoose
      .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to DB successfully");
      })
      .catch((err) => {
        console.error("Error connecting to DB. Retrying in 5 seconds...", err);
        setTimeout(connectWithRetry, 5000);
      });
  };

  connectWithRetry();

  mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from DB. Attempting to reconnect...");
    connectWithRetry();
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("DB connection closed due to app termination");
    process.exit(0);
  });
}

module.exports = { connectToMongoDB };
