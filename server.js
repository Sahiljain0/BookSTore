
// *******************************SERVER CODE*************************

const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Test API endpoint
app.get("/", (req, res) => res.send("API is running"));

// Swagger documentation endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define API Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/books", require("./routes/api/books"));
app.use("/api/purchases", require("./routes/api/purchases"));

// Catch-All Route for Undefined Endpoint
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Define the server port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app; // Export app for testing purposes
