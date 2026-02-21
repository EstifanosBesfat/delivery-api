const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
    try {
        const { restaurantId, total } = req.body;

        if (!restaurantId || !total) {
            return res.status(400).json({ error: "Restaurant ID and Total are required" });
        }

        const result = await orderService.createOrder(restaurantId, total);

        res.status(201).json({
            message: "Order placed successfully! 🚀",
            orderId: result.order.id,
            driver: result.driver.name,
            status: "Assigned"
        });

    } catch (error) {
        console.error(error);
        if (error.message === "No drivers available") {
            return res.status(404).json({ error: "All drivers are busy. Please try again later." });
        }
        res.status(500).json({ error: "Order failed" });
    }
};

module.exports = { createOrder };