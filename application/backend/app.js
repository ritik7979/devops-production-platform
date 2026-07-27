require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const productRoutes = require("./routes/productRoutes");

app.use("/api", productRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "backend",
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
