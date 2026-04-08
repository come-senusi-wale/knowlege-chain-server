import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../../database/models/user.model";
import { OTP_EXPIRY_TIME, generateOTP } from "../../utils/otpGenerator";
import { sendUserAccountVerificationEmail } from "../../utils/send-email.util";


export const userCreateAccountController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      walletAddress,
    } = req.body;

    const walletModify = walletAddress.toString().toLowerCase();

    const checkWallet = await UserModel.findOne({walletAddress: walletModify})
    if (checkWallet) {
      res.json({
        status: true,
        message: "wallet address captured successfully",
        user: {
          id: checkWallet._id,
          walletAddress: checkWallet.walletAddress,
        },

      });
    }else{
      const user = new UserModel({
        walletAddress: walletModify
      });

      let userSaved = await user.save();

      res.json({
        status: true,
        message: "wallet address captured successfully",
        user: {
          id: userSaved._id,
          walletAddress: userSaved.walletAddress,
        },

      });
    }

    
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}

export const checkUserWalletAddressController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      walletAddress,
    } = req.query;
  
    const userWalletExists = await UserModel.findOne({ walletAddress: walletAddress!.toString().toLowerCase() });
  
    if (userWalletExists) {
      res.json({
        status: true,
        message: "user wallet exist",
        user: {
          id: userWalletExists._id,
          walletAddress: userWalletExists.walletAddress,
        },
  
      });
    }else{

      res.json({
        status: false,
        message: "user wallet do not exist",
      });

    }
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}

export const userProvideEmailController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      walletAddress,
      email,
      name,
      phoneNumber
    } = req.body;
  
    const userWalletExists = await UserModel.findOne({ walletAddress: walletAddress.toString().toLowerCase() });
  
    if (!userWalletExists) {
      return res
        .status(401)
        .json({ message: "please connect your wallet and buy a token" });
    }

    const user = await UserModel.findOne({ userEmail: email });

    if (user) {
      if (user.emailOtp.verified) {
        return res
            .status(401)
            .json({ message: "email already verified" });
      }else{
        const otp = generateOTP()
        const createdTime = new Date();

        user!.emailOtp = {
          otp,
          createdTime,
          verified : false
  
        }

        await user?.save();

        let emailData = {
            emailTo: email,
            subject: "Knowledge Chain email verification",
            otp,
            firstName: user.name,
        };

        sendUserAccountVerificationEmail(emailData);
        return res.status(200).json({ message: "OTP sent successfully to your email." });

      }
    }

    const otp = generateOTP()
    const createdTime = new Date();

    userWalletExists.name = name
    userWalletExists.userEmail = email
    userWalletExists.phoneNumber = phoneNumber

    userWalletExists!.emailOtp = {
      otp,
      createdTime,
      verified : false
    }

    await userWalletExists?.save();

    let emailData = {
        emailTo: email,
        subject: "Knowledge Chain email verification",
        otp,
        firstName: name,
    };

    sendUserAccountVerificationEmail(emailData);
    return res.status(200).json({ message: "OTP sent successfully to your email." });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


export const userVerifyEmailController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      email,
      otp
    } = req.body;
  
    const user = await UserModel.findOne({ userEmail: email });
    
    // check if user exists
    if (!user) {
     return res
       .status(401)
       .json({ message: "invalid email" });
   }

   if (user.emailOtp.otp != otp) {
       return res
       .status(401)
       .json({ message: "invalid otp" });
   }

   if (user.emailOtp.verified) {
       return res
       .status(401)
       .json({ message: "email already verified" });
   }

   const timeDiff = new Date().getTime() - user.emailOtp.createdTime.getTime();
   if (timeDiff > OTP_EXPIRY_TIME) {
       return res.status(400).json({ message: "otp expired" });
   }

   user.emailOtp.verified = true;

   await user.save();

   return res.json({ message: "email verified successfully" });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


export const checkUserEmailVerifiedController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      walletAddress,
    } = req.query;
  
    const user = await UserModel.findOne({ walletAddress: walletAddress!.toString().toLowerCase() });
 
    if (!user) {
     return res
       .status(401)
       .json({ message: "invalid email" });
    }

    if (!user.userEmail || user.userEmail == null) {
      return res
        .status(401)
        .json({ message: "please verify your profile" });
    }

   if (user.emailOtp.verified) {
    res.json({
      status: true,
      message: "email verified",
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        email: user.userEmail,
        emailStatus: user.emailOtp.verified
      },

    });
   }else{
    res.json({
      status: false,
      message: "email not verified",
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        email: user.userEmail,
        emailStatus: user.emailOtp.verified
      },

    });
   }
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


