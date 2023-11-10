const express = require("express");
const CustSupportRouter = express.Router();
const {
  createQueries,
  getQueries,
  resolveQuery,
  getResolvedQueries,
  getQueriesAnalytics,
} = require("../controller/CustSupport");
const { verifyToken } = require("../middleware/authMiddleware");

CustSupportRouter.post("/createQueries", verifyToken, createQueries);
CustSupportRouter.get("/getQueries", verifyToken, getQueries);
CustSupportRouter.post("/resolveQuery", verifyToken, resolveQuery);
CustSupportRouter.get("/getResolvedQueries", verifyToken, getResolvedQueries);
CustSupportRouter.get("/analytics", verifyToken, getQueriesAnalytics);

module.exports = { CustSupportRouter };
