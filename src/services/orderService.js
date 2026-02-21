const db = require("../config/db");

const createOrder = async (restaurantId, total) => {
  const client = await db.pool.connect();

  try {
    await client.query("begin");

    const orderRes = await client.query(
      "insert into orders (restaurant_id, total_price) values ($1, $2) returning *",
      [restaurantId, total],
    );
    const order = orderRes.rows[0];

    // find nearest avaliable driver
    // We lock this driver row
    const driverRes = await client.query(
      `
      SELECT id, name 
      FROM drivers 
      WHERE is_available = true 
      ORDER BY location <-> (SELECT location FROM restaurants WHERE id = $1) 
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    `,
      [restaurantId],
    );

    const driver = driverRes.rows[0];

    if (!driver) {
      throw new Error("No drivers available");
    }

    // assign driver to order
    await client.query(
      "UPDATE orders SET driver_id = $1, status = 'assigned' WHERE id = $2",
      [driver.id, order.id],
    );

    // mark the driver as busy
    await client.query(
      "UPDATE drivers SET is_available = false WHERE id = $1",
      [driver.id],
    );

    // commit
    await client.query("commit");

    return { order, driver };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { createOrder };
