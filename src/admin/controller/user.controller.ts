import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import UserModel from "../../database/models/user.model";
import { sendUserMessageEmail } from "../../utils/send-email.util";
import { sheets } from "./../../utils/google/google.auth";
import UserTestModel from "../../database/models/userTest.model";
import TestModel from "../../database/models/test.model";

// export const getSingleUserController = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     const { userId } = req.query;

//     // Validate request
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     // 1️⃣ Get user
//     const user = await UserModel.findById(userId);

//     if (!user || !user.email) {
//       return res.status(401).json({
//         message: "User does not exist or has no email",
//       });
//     }

//     // 2️⃣ Check if user started test
//     const userTest = await UserTestModel.findOne({
//       user: user._id,
//     });

//     if (!userTest) {
//       return res.status(401).json({
//         message: "User has not started test",
//       });
//     }

//     // 3️⃣ Get test
//     const question = await TestModel.findById(userTest.test);

//     if (!question) {
//       return res.status(401).json({
//         message: "Test question not found",
//       });
//     }

//     // 4️⃣ Fetch Google Sheet
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: question.spreadSheetUrl,
//       range: "Form Responses 1",
//     });

//     const rows = response.data.values as string[][] | undefined;

//     if (!rows || rows.length <= 1) {
//       return res.status(401).json({
//         message: "No result found yet",
//       });
//     }

//     const headers: string[] = rows[0];
//     const values: string[][] = rows.slice(1);

//     // 5️⃣ Convert rows → objects
//     const results = values.map((row: string[]) => {
//       const obj: Record<string, string> = {};

//       headers.forEach((header: string, index: number) => {
//         obj[header] = row[index] ?? "";
//       });

//       return obj;
//     });

//     // 🔍 6️⃣ Find ONLY this user's result by email
//     // ⚠️ Change "Email" if your column name is different
//     const userResult = results.find(
//       (item )=>{
//         console.log("item", item)
//         return item["Email Address"]?.toLowerCase() === user.email!.toLowerCase()
//     });

//     if (!userResult) {
//       return res.status(404).json({
//         message: "No test result found for this user",
//       });
//     }

//     // 7️⃣ Return single user + his result
//     return res.status(200).json({
//       user,
//       testResult: userResult,
//     });
//   } catch (err: any) {
//     console.error(err);
//     return res.status(500).json({
//       message: err.message,
//     });
//   }
// };

export const getSingleUserController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.query;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 1️⃣ Get user
    const user = await UserModel.findById(userId);

    if (!user || !user.email) {
      return res.status(401).json({
        message: "User does not exist or has no email",
      });
    }

    // 2️⃣ Check if user started test
    const userTest = await UserTestModel.findOne({
      user: user._id,
    });

    if (!userTest) {
      return res.status(401).json({
        message: "User has not started test",
      });
    }

    // 3️⃣ Get test
    const question = await TestModel.findById(userTest.test);

    if (!question) {
      return res.status(401).json({
        message: "Test question not found",
      });
    }

    // 4️⃣ Fetch Google Sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: question.spreadSheetUrl,
      range: "Form Responses 1",
    });

    const rows = response.data.values as string[][] | undefined;

    if (!rows || rows.length <= 1) {
      return res.status(401).json({
        message: "No result found yet",
      });
    }

    const headers = rows[0];        // header row
    const values = rows.slice(1);   // actual responses

    // 5️⃣ Find email column index dynamically (SAFE)
    const emailColumnIndex = headers.findIndex(
      h => h.toLowerCase() === "email address"
    );

    if (emailColumnIndex === -1) {
      return res.status(500).json({
        message: "Email column not found in sheet",
      });
    }

    // 6️⃣ Find THIS user's row
    const userRow = values.find(
      row =>
        row[emailColumnIndex]?.toLowerCase() ===
        user.email!.toLowerCase()
    );

    if (!userRow) {
      return res.status(404).json({
        message: "No test result found for this user",
      });
    }

    // 7️⃣ RETURN ARRAY FORMAT ✅
    return res.status(200).json({
      user,
      testResult: [
        headers,
        userRow,
      ],
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};



export const getAllUserController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      page,
      limit,
      search
    } = req.query;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pageCheck: number = parseInt(page as string) || 1; // or get from query params
    const limitCheck: number = parseInt(limit as string) || 50;
    const skip = (pageCheck - 1) * limitCheck;

    const query: any = { }

    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await UserModel.find(query).skip(skip).limit(limitCheck).sort({createdAt: -1})

    const total = await UserModel.countDocuments(query)
      
    res.json({
      totalPages: Math.ceil(total / limitCheck),
      currentPage: pageCheck,
      total,
      users

    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


export const getAllUserNotPaidController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      page,
      limit,
      search
    } = req.query;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pageCheck: number = parseInt(page as string) || 1; // or get from query params
    const limitCheck: number = parseInt(limit as string) || 50;
    const skip = (pageCheck - 1) * limitCheck;

    // 🔍 Build search query
    const query: any = { paid: false }

    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await UserModel.find(query).skip(skip).limit(limitCheck).sort({createdAt: -1})

    const total = await UserModel.countDocuments(query)
      
    res.json({
      totalPages: Math.ceil(total / limitCheck),
      currentPage: pageCheck,
      total,
      users

    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


export const messageSingleUserController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      userId,
      message,
      subject
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
     return res
       .status(401)
       .json({ message: "User do not exist" });
    }

    if (!user.email || user.email == undefined) {
      return res
       .status(401)
       .json({ message: "User Profile not verify" });
    }

    let emailData = {
      emailTo: user.email,
      subject: subject,
      message,
      firstName: user.name,
    };
    
    sendUserMessageEmail(emailData);

    return res.status(200).json({ message: "email sent successfully" });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


export const messageAllUsersController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { message, subject } = req.body

    // Validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Fetch users with emails
    const users = await UserModel.find({
      email: { $exists: true, $ne: null },
    }).select('email name')

    if (!users.length) {
      return res.status(404).json({
        message: 'No users with valid email found',
      })
    }

    let sentCount = 0

    for (const user of users) {
      try {
        const emailData = {
          emailTo: user.email,
          subject,
          message,
          firstName: user.name,
        }

        await sendUserMessageEmail(emailData)
        sentCount++
      } catch (err) {
        console.error(`Failed to send to ${user.email}`, err)
        // continue sending to others
      }
    }

    return res.status(200).json({
      message: 'Bulk email sent successfully',
      totalUsers: users.length,
      emailsSent: sentCount,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
