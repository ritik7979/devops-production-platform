const db = require("../config/db");

exports.getProducts = (req, res) => {

    db.query("SELECT * FROM products", (err, results) => {

        if (err) {
            console.error("Database Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch products"
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    });

};
