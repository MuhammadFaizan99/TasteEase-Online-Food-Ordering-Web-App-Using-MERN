const { customerModel } = require("../model/CustSupportSch");

const createQueries = async (req, res) => {
  try {
    const { Name, Email, Query } = req.body;
    const user = req.userId;

    const newQuery = new customerModel({
      Name,
      Email,
      Query,
      user,
    });

    const savedQuery = await newQuery.save();

    res.status(201).json(savedQuery);
  } catch (error) {
    console.error("Error creating query:", error);
    res.status(500).json({ message: "Error creating query." });
  }
};

const getQueries = async (req, res) => {
  try {
    const user = req.userId;

    const queries = await customerModel.find({ user });

    res.json(queries);
  } catch (error) {
    console.error("Error getting queries:", error);
    res.status(500).json({ message: "Error getting queries." });
  }
};

const resolveQuery = async (req, res) => {
  try {
    const { queryId, Answer } = req.body;

    const resolvedQuery = await customerModel.findByIdAndUpdate(
      queryId,
      {
        Resolved: true,
        Answer,
      },
      { new: true } // Return the updated document
    );

    res.json(resolvedQuery);
  } catch (error) {
    console.error("Error resolving query:", error);
    res.status(500).json({ message: "Error resolving query." });
  }
};
const getResolvedQueries = async (req, res) => {
  try {
    const user = req.userId;

    const resolvedQueries = await customerModel.find({ user, Resolved: true });

    res.json(resolvedQueries);
  } catch (error) {
    console.error("Error getting resolved queries:", error);
    res.status(500).json({ message: "Error getting resolved queries." });
  }
};

const getQueriesAnalytics = async (req, res) => {
  try {
    const { timeRange, analyticsType } = req.query;

    const currentDate = new Date();
    const options = { timeZone: "UTC" };

    let startDate;
    let endDate = new Date();

    switch (timeRange) {
      case "today":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        break;
      case "yesterday":
        startDate = new Date(currentDate.toLocaleDateString(undefined, options));
        startDate.setDate(startDate.getDate() - 1);
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

    switch (analyticsType) {
      case "customers":
        analyticsData = await customerModel.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lt: endDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              Total: { $sum: 1 },
            },
          },
        ]);
        break;

      default:
        analyticsData = [];
        break;
    }

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Error fetching customer analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createQueries,
  getQueries,
  getResolvedQueries,
  resolveQuery,
  getQueriesAnalytics,
};
