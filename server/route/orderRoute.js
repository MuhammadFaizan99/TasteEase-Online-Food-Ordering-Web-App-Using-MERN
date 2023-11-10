const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
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
  
} = require("../controller/order");

const orderRouter = express.Router();

orderRouter.post("/createOrder", verifyToken, createOrder);
orderRouter.get("/getLoginUserOrder", verifyToken, getLoginUserOrder);
orderRouter.get("/getAllUsersOrder", verifyToken, getAllUserOrder);
orderRouter.put("/updateOrderStatus/:orderId", verifyToken, updateOrderStatus);
orderRouter.get("/analytics", verifyToken, getOrderAnalytics);
orderRouter.get("/getTotalUserOrders", verifyToken, getTotalUserOrders); 
orderRouter.get("/getLastUserOrder", verifyToken, getLastUserOrder);
orderRouter.get("/getUserFavoriteItems", verifyToken, getUserFavoriteItems);
orderRouter.get("/getLastThreeUserOrders", verifyToken, getLastThreeUserOrders);
orderRouter.get("/getMostOrderedMenuItems", verifyToken, getMostOrderedMenuItems);

module.exports = { orderRouter };
