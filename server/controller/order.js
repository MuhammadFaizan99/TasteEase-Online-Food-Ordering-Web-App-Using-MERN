const { orderModel } = require("../model/orderSch");
const { menuModel } = require("../model/menuSch")
const cron = require("node-cron");

const createOrder = async (req, res) => {
  try {
    const { name, address, items } = req.body;
    const userId = req.userId;

    // If item name and quantity are provided, include the item in the items array
    const orderItems = [];
    if (items) {
      for (const item of items) {
        if (item.name && item.quantity) {
          orderItems.push({ name: item.name, quantity: item.quantity });
        }
      }
    }

    const newOrder = new orderModel({
      userId,
      name,
      address,
      items: orderItems,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Could not create the order." });
  }
};




const getLoginUserOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel.find({ userId });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    // Fetch the menu to get item prices
    const menuItems = await menuModel.find({}, "name price");

    const ordersWithTotalPrice = orders.map(order => {
      const totalPrice = order.items.reduce((total, item) => {
        const menuItem = menuItems.find(menuItem => menuItem.name === item.name);
        return total + (menuItem ? menuItem.price * item.quantity : 0);
      }, 0);
      return { ...order.toObject(), totalPrice };
    });

    res.status(200).json(ordersWithTotalPrice);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Could not retrieve orders." });
  }
}

const getLastUserOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const lastOrder = await orderModel
      .findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("items.name", "name price"); // Make sure "name" and "price" are the correct field names

    if (!lastOrder) {
      return res.status(404).json({ message: "No orders found." });
    }

    // Calculate the total price for the last order
    let totalPrice = 0;
    for (const item of lastOrder.items) {
      totalPrice += item.quantity * item.name.price;
    }

    const orderWithTotalPrice = {
      ...lastOrder.toObject(),
      totalPrice: totalPrice.toFixed(2), // Format to 2 decimal places
    };

    res.status(200).json(orderWithTotalPrice);
  } catch (error) {
    console.error("Error fetching last order:", error);
    res.status(500).json({ error: "Could not retrieve last order." });
  }
};



const getAllUserOrder = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    let ordersQuery = orderModel.find();

    const timeFilter = req.query.timeFilter;

    let today = new Date();

    if (timeFilter === "today") {
      today.setHours(0, 0, 0, 0);
      ordersQuery = ordersQuery.where("createdAt").gte(today);
    } else if (timeFilter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      ordersQuery = ordersQuery.where("createdAt").gte(yesterday).lte(today);
    } else if (timeFilter === "1week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      oneWeekAgo.setHours(0, 0, 0, 0);
      ordersQuery = ordersQuery.where("createdAt").gte(oneWeekAgo);
    } else if (timeFilter === "1month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      oneMonthAgo.setHours(0, 0, 0, 0);
      ordersQuery = ordersQuery.where("createdAt").gte(oneMonthAgo);
    } else if (timeFilter === "1year") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      oneYearAgo.setHours(0, 0, 0, 0);
      ordersQuery = ordersQuery.where("createdAt").gte(oneYearAgo);
    } else if (timeFilter === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      ordersQuery = ordersQuery.where("createdAt").gte(tomorrow);
    }

    const orders = await ordersQuery.exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Could not retrieve orders." });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    if (!["delivered", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Could not update order status" });
  }
};

const getOrderAnalytics = async (req, res) => {
  try {
    const { timeRange, timeZone } = req.query;

    const currentDate = new Date();
    const options = { timeZone: timeZone };

    let startDate;
    let endDate = new Date();

    switch (timeRange) {
      case "today":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        break;
      case "yesterday":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        break;
      case "week":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0);
        break;
    }

    let analyticsData;

    switch (timeRange) {
      case "today":
      case "yesterday":
      case "week":
      case "month":
      case "year":
        analyticsData = await orderModel.countDocuments({
          createdAt: { $gte: startDate, $lt: endDate },
        });
        break;
      default:
        analyticsData = [];
        break;
    }

    res.status(200).json([{ Name: timeRange, Total: analyticsData }]);
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getTotalUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const totalCompletedOrders = await orderModel.countDocuments({ userId, status: "completed" });

    res.status(200).json({ totalCompletedOrders });
  } catch (error) {
    console.error("Error fetching total completed user orders:", error);
    res.status(500).json({ error: "Could not retrieve total completed orders." });
  }
};


const getUserFavoriteItems = async (req, res) => {
  try {
    const userId = req.userId;

    const completedOrders = await orderModel.find({
      userId,
      status: "completed",
    });

    const orderedItems = completedOrders.flatMap(order => order.items.map(item => item.name));

    const itemCounts = orderedItems.reduce((countMap, item) => {
      countMap[item] = (countMap[item] || 0) + 1;
      return countMap;
    }, {});

    const sortedItems = Object.keys(itemCounts).sort((a, b) => itemCounts[b] - itemCounts[a]);
    const topItems = sortedItems.slice(0, 3);

    const favoriteItemsWithCounts = topItems.map(item => `${item} - ${itemCounts[item]} times`);

    res.status(200).json(favoriteItemsWithCounts);
  } catch (error) {
    console.error("Error fetching user's favorite items:", error);
    res.status(500).json({ error: "Could not retrieve favorite items." });
  }
};

const getLastThreeUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const lastThreeOrders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('items.name', 'name price')
      .exec();

    res.status(200).json(lastThreeOrders);
  } catch (error) {
    console.error('Error fetching last three orders:', error);
    res.status(500).json({ error: 'Could not retrieve last three orders.' });
  }
};
const getMostOrderedMenuItems = async (req, res) => {
  try {
    const completedOrders = await orderModel.find({
      status: "completed",
    });

    const orderedItems = completedOrders.flatMap(order =>
      order.items.map(item => item.name)
    );

    const itemCounts = orderedItems.reduce((countMap, item) => {
      countMap[item] = (countMap[item] || 0) + 1;
      return countMap;
    }, {});

    const sortedItems = Object.keys(itemCounts).sort(
      (a, b) => itemCounts[b] - itemCounts[a]
    );
    
    // Get the top 3 most ordered menu items
    const topItems = sortedItems.slice(0, 3);

    // Fetch menu items details for the top ordered items
    const mostOrderedItems = await menuModel.find({ name: { $in: topItems } });

    res.status(200).json(mostOrderedItems);
  } catch (error) {
    console.error("Error fetching most ordered menu items:", error);
    res.status(500).json({ error: "Could not retrieve most ordered items." });
  }
};





module.exports = {
  createOrder,
  getLoginUserOrder,
  getAllUserOrder,
  updateOrderStatus,
  getOrderAnalytics,
  getTotalUserOrders,
  getLastUserOrder,
  getUserFavoriteItems,
  getLastThreeUserOrders,
  getMostOrderedMenuItems
};
