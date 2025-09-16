import OrderStatus from "../models/orderStatus.model.js";
import dotenv from "dotenv";
import sendResponse from "../utils/response.js";
dotenv.config({ quiet: true });
import mongoose from "mongoose";

export const getAllTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 60,
      status,
      school_id,
      date,
      search,
      sort = "payment_time",
      order = "desc",
    } = req.query;

    const pipeline = [
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "orderInfo",
        },
      },
      { $unwind: "$orderInfo" },
      {
        $lookup: {
          from: "schools",
          localField: "orderInfo.school_id",
          foreignField: "_id",
          as: "schoolInfo",
        },
      },
      { $unwind: { path: "$schoolInfo", preserveNullAndEmptyArrays: true } },
    ];

    const postLookupMatch = {};

    if (status) {
      postLookupMatch.status = status;
    }

    if (school_id) {
      postLookupMatch["orderInfo.school_id"] = new mongoose.Types.ObjectId(
        school_id
      );
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      postLookupMatch.payment_time = { $gte: start, $lt: end };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      postLookupMatch.$or = [
        { "orderInfo._id": { $regex: searchRegex } },
        { "orderInfo.student_info.name": { $regex: searchRegex } },
        { collect_request_id: { $regex: searchRegex } },
        { "schoolInfo.name": { $regex: searchRegex } },
      ];
    }

    if (Object.keys(postLookupMatch).length > 0) {
      pipeline.push({ $match: postLookupMatch });
    }

    pipeline.push({
      $project: {
        _id: 1,
        collect_request_id: 1,
        custom_order_id: "$orderInfo._id",
        student_info: "$orderInfo.student_info",
        school_id: "$orderInfo.school_id",
        school_name: "$schoolInfo.name", // ✅ add school name here
        transaction_amount: 1,
        order_amount: 1,
        gateway_name: "$orderInfo.gateway_name",
        status: 1,
        payment_time: 1,
      },
    });

    pipeline.push(
      { $sort: { [sort]: order === "asc" ? 1 : -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );

    const transactions = await OrderStatus.aggregate(pipeline);

    // Count total without pagination/sort
    const countPipeline = pipeline.filter(
      (stage) =>
        !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
    );
    countPipeline.push({ $count: "total" });
    const countResult = await OrderStatus.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    return sendResponse(
      res,
      true,
      "Transactions fetched successfully",
      {
        data: transactions,
        total,
        totalPages: Math.ceil(total / limit),
      },
      200
    );
  } catch (err) {
    return sendResponse(res, false, err.message, null, 500);
  }
};

export const getTransactionsBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const transactionsBySchool = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "orderInfo",
        },
      },
      { $unwind: "$orderInfo" },
      { $match: { "orderInfo.school_id": schoolId } },
    ]);

    return sendResponse(
      res,
      true,
      "Trnasactions By School fetched successfully",
      transactionsBySchool,
      200
    );
  } catch (err) {
    return sendResponse(res, false, err.message, null, 500);
  }
};

export const getTransactionStatus = async (req, res) => {
  try {
    const { custom_order_id } = req.params;

    const orderStatus = await OrderStatus.findOne({
      collect_id: new mongoose.Types.ObjectId(custom_order_id),
    });

    if (!orderStatus) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return sendResponse(
      res,
      true,
      "Trnasactions fetched successfully",
      orderStatus,
      200
    );
  } catch (err) {
    return sendResponse(res, false, err.message, null, 500);
  }
};
