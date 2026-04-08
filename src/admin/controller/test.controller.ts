import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import TestModel from "../../database/models/test.model";
import UserModel from "../../database/models/user.model";
import { sheets } from "./../../utils/google/google.auth";

export const adminAddTestController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const {
      name,
      testUrl,
      spreadsheetUrl
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const checkTest = await TestModel.findOne({ name });

     // check if user exists
     if (checkTest) {
      return res
        .status(401)
        .json({ message: "Test exists already" });
    }
  
    const test = new TestModel({
      name,
      url: testUrl,
      spreadSheetUrl: spreadsheetUrl
    });
    
    let testSaved = await test.save();
  
    res.json({
      message: "Test added successfully",
      test: {
        id: testSaved._id,
        name: testSaved.name,
      },
  
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}


export const getAllTestController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      page,
      limit,
    } = req.query;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pageCheck: number = parseInt(page as string) || 1; // or get from query params
    const limitCheck: number = parseInt(limit as string) || 50;
    const skip = (pageCheck - 1) * limitCheck;

    const Questions = await TestModel.find().skip(skip).limit(limitCheck).sort({createdAt: -1})

    const total = await TestModel.countDocuments()
      
    res.json({
      totalPages: Math.ceil(total / limitCheck),
      currentPage: pageCheck,
      total,
      Questions

    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


// export const getTestResultController = async (
//   req: Request,
//   res: Response,
// ) => {

//   try {
//     const {
//       page,
//       limit,
//       spreadsheetsId
//     } = req.query;
//     // Check for validation errors
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const pageCheck: number = parseInt(page as string) || 1; // or get from query params
//     const limitCheck: number = parseInt(limit as string) || 50;
//     const skip = (pageCheck - 1) * limitCheck;

//     const question = await TestModel.findOne({spreadSheetUrl: spreadsheetsId})

//      if (!question) {
//      return res
//        .status(401)
//        .json({ message: "Question not found" });
//     }

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetsId,
//       range: "Form Responses 1", // default sheet name
//     });

//     const rows = response.data.values;

//     if (!rows || rows.length === 0) {
//       return res
//        .status(401)
//        .json({ message: "No Result found Yet" });
//     }

//     const total = rows.length - 1

//     const headers = rows[0];

//     // Remaining rows = user responses
//     const data = rows.slice(1).map(row => {
//       let obj = {};
//       headers.forEach((header, index) => {
//         obj[header] = row[index] || "";
//       });
//       return obj;
//     });
      
//     res.json({
//       totalPages: Math.ceil(total / limitCheck),
//       currentPage: pageCheck,
//       total,
//       data

//     });

//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }

// }

export const getTestResultController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { page, limit, spreadsheetsId } = req.query;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pageCheck: number = parseInt(page as string) || 1;
    const limitCheck: number = parseInt(limit as string) || 50;
    const skip = (pageCheck - 1) * limitCheck;

    // Check if test exists
    const question = await TestModel.findOne({
      spreadSheetUrl: spreadsheetsId,
    });

    if (!question) {
      return res.status(401).json({
        message: "Question not found",
      });
    }

    // Fetch Google Sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetsId as string,
      range: "Form Responses 1",
    });

    const rows = response.data.values as string[][] | undefined;

    if (!rows || rows.length <= 1) {
      return res.status(401).json({
        message: "No Result found Yet",
      });
    }

    const headers: string[] = rows[0];
    const values: string[][] = rows.slice(1);

    const total = values.length;

    // Pagination on sheet data
    const paginatedRows = values.slice(skip, skip + limitCheck);

    // Map rows to objects
    const data = paginatedRows.map((row: string[]) => {
      const obj: Record<string, string> = {};

      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] ?? "";
      });

      return obj;
    });

    return res.status(200).json({
      totalPages: Math.ceil(total / limitCheck),
      currentPage: pageCheck,
      total,
      data,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};


export const getTestResultControllerTwo = async (
  req: Request,
  res: Response,
) => {
  try {
    const { page, limit, spreadsheetsId } = req.query;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pageCheck = parseInt(page as string) || 1;
    const limitCheck = parseInt(limit as string) || 50;
    const skip = (pageCheck - 1) * limitCheck;

    // Check if test exists
    const question = await TestModel.findOne({
      spreadSheetUrl: spreadsheetsId,
    });

    if (!question) {
      return res.status(401).json({
        message: "Question not found",
      });
    }

    // Fetch Google Sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetsId as string,
      range: "Form Responses 1",
    });

    const rows = response.data.values as string[][] | undefined;

    if (!rows || rows.length <= 1) {
      return res.status(401).json({
        message: "No Result found Yet",
      });
    }

    const headers: string[] = rows[0];
    const values: string[][] = rows.slice(1);

    // Convert sheet rows → objects
    const mappedResults = values.map((row: string[]) => {
      const obj: Record<string, string> = {};

      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] ?? "";
      });

      return obj;
    });

    // 🔍 Extract emails from sheet (adjust key if needed)
    const emailsFromSheet = mappedResults
      .map(item => item["Email Address"]?.toLowerCase())
      .filter(Boolean);

    // Find users with matching emails
    const users = await UserModel.find({
      email: { $in: emailsFromSheet },
    }).select("email");

    const userEmailSet = new Set(
      users.map(u => u.userEmail.toLowerCase())
    );

    // ✅ Keep only sheet responses with email in DB
    // const filteredResults = mappedResults.filter((item) =>{
    //   console.log("item",item)
    //   userEmailSet.has(item["Email Address"]?.toLowerCase())
    // });

    const filteredResults = mappedResults.filter(item => {
      const email = item["Email Address"]?.toLowerCase();
      console.log("checking email:", email);
      return userEmailSet.has(email);
    });

    const total = filteredResults.length;

    // Pagination AFTER filtering
    const paginatedData = filteredResults.slice(
      skip,
      skip + limitCheck
    );

    return res.status(200).json({
      totalPages: Math.ceil(total / limitCheck),
      currentPage: pageCheck,
      total,
      data: paginatedData,
      response: rows,
      mappedResults,
      emailsFromSheet,
      users,
      userEmailSet,
      filteredResults

    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};


export const getTestResultControllerTre = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit, spreadsheetsId } = req.query;

    // ✅ Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pageCheck = parseInt(page as string) || 1;
    const limitCheck = parseInt(limit as string) || 50;
    const skip = (pageCheck - 1) * limitCheck;

    // ✅ Check test existence
    const question = await TestModel.findOne({
      spreadSheetUrl: spreadsheetsId,
    });

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // ✅ Fetch Google Sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetsId as string,
      range: "Form Responses 1",
    });

    

    const rows = response.data.values as string[][] | undefined;

    if (!rows || rows.length <= 1) {
      return res.status(404).json({
        message: "No Result found yet",
      });
    }

    // ✅ Separate headers and values
    const headers = rows[0];
    const values = rows.slice(1);

    // ✅ Find Email column index (robust)
    const emailColumnIndex = headers.findIndex(h =>
      h.toLowerCase().includes("email")
    );

    if (emailColumnIndex === -1) {
      return res.status(400).json({
        message: "Email column not found in sheet",
      });
    }

    // ✅ Extract emails from sheet
    const emailsFromSheet = values
      .map(row => row[emailColumnIndex]?.toLowerCase())
      .filter(Boolean);

    // ✅ Fetch users with matching emails
    const users = await UserModel.find({
      userEmail : { $in: emailsFromSheet },
    }).select("userEmail");


    const userEmailSet = new Set(
      users.map(u => u.userEmail.toLowerCase())
    );

    // ✅ Filter sheet rows by DB users
    const filteredRows = values.filter(row => {
      const email = row[emailColumnIndex]?.toLowerCase();
      return userEmailSet.has(email);
    });

    // ✅ Pagination AFTER filtering
    const paginatedRows = filteredRows.slice(
      skip,
      skip + limitCheck
    );

    // ✅ FINAL RESPONSE (Google Sheet format)
    return res.status(200).json({
      totalPages: Math.ceil(filteredRows.length / limitCheck),
      currentPage: pageCheck,
      total: filteredRows.length,
      data: [
        headers,          // 👈 header row
        ...paginatedRows  // 👈 filtered user rows
      ],
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Server error",
    });
  }
};