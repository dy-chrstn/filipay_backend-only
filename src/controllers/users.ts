import express from "express";
import bcrypt from "bcrypt";
import moment from "moment";
import mongoose from "mongoose";
import { createWallet, updateWallet, getWallet } from "../services/wallet";
import { createTransactionHistory, findTransactionHistories } from "../services/transactionHistory";

import {
  createUser,
  getUserByEmail,
  updateUser,
  getUserById,
} from "../services/users";

export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");

  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        messages: {
          code: 1,
          message: "Email and password are required",
          timestamp: timestamp,
        },
        response: {}
      });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        messages: {
          code: 1,
          message: "User not found",
          timestamp: timestamp,
        },
        response: {}

      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.status(200).json(

        {
          messages: {
            code: 0,
            message: "User logged in successfully"
          },
          response: {
            id: user._id,
            email: user.email,
            pin: user.pin,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            type: user.type,
            address: user.address,
            birthday: user.birthday,
            mobileNumber: user.mobileNumber,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },

        });
    } else {
      return res.status(400).json({
        messages: {
          code: 1,
          message: "Invalid email or password",
          timestamp: timestamp,
        },
        response: {}

      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      messages: {
        code: 1,
        message: "Internal server error",
        timestamp: timestamp,
      },
      response: {}


    });
  }
};

export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      email,
      password,
      firstName,
      middleName,
      lastName,
      type,
      address,
      birthday,
      mobileNumber,
      pin,
    } = req.body;

    if (!email || !password) {
      return res.sendStatus(400).json({
        code: 1,
        message: "Email and password are required",
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        messages: {
          code: 1,
          message: "Email already exists",
        },
        response: {}
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    let newUser = {
      email: email,
      password: hashPassword,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      type: type,
      address: address,
      birthday: birthday,
      mobileNumber: mobileNumber,
      pin: pin,
    };

    try {
      const user = await createUser(newUser);

      const wallet = await createWallet(user._id);

      return res.status(200).json({
        messages: {
          code: 0,
          message: "User created",
        },
        response: {
          user,
          wallet,
        }
      });
    } catch (error) {
      console.log("Error creating user: ", error);
      return res.sendStatus(400).json({
        messages: {
          code: 1,
          message: "Error creating user",
        },
        response: {}
      });
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).json({
      messages: {
        code: 1,
        message: "Internal server error",
      },
      response: {}
    });
  }
};

export const completeRegistration = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;

  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const user = await getUserById(objectId);

    if (!user) {
      return res.status(400).json({
        messages: {
          code: 1,
          message: "User not found",
        },
        response: {}

      });
    }

    const updatedUser = await updateUser(user._id, req.body);

    return res.status(200).json({
      messages: {
        code: 0,
        message: "User updated"
      },
      response: {
        _id: updatedUser._id,
        email: updatedUser.email,
        pin: updatedUser.pin,
        firstName: updatedUser.firstName,
        middleName: updatedUser.middleName,
        lastName: updatedUser.lastName,
        type: updatedUser.type,
        address: updatedUser.address,
        birthday: updatedUser.birthday,
        mobileNumber: updatedUser.mobileNumber,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }

    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messages: {
        code: 1,
        message: "Internal server error",
      },
      response: {}

    });
  }
};

export const findWallet = async (req: express.Request, res: express.Response) => {
  try {
    const id = req.params.id;

    const wallet = await getWallet(id);
    return res.status(200).json({
      messages: {
        code: 0,
        message: "Wallet found",
      },
      response: {
        _id: wallet._id,
        userId: wallet.userId,
        balance: wallet.balance,
        sNo: wallet.sNo,
        cardId: wallet.cardId,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messages: {
        code: 1,
        message: "Internal server error",
      },
      response: {}
    });
  }
}

export const updateBalance = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;
  const { balance, userId, referenceCode, paymentMethod, serviceFee, status } = req.body;
  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const user = await getUserById(objectId);
    const beforeBalance = await getWallet(id);
    const wallet = await updateWallet(id, balance);

    const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`;

    const newHistory = await createTransactionHistory(
      userId,
      referenceCode,
      paymentMethod,
      serviceFee,
      status,
      fullName,
      beforeBalance.balance,
      balance,
      "Balance updated"
    );

    if (!user) {
      return res.status(400).json({
        messages: {
          code: 1,
          message: "User not found",
        },
        response: {}

      });
    }

    if (!wallet) {
      return res.status(400).json({
        messages: {
          code: 1,
          message: "Wallet not found",
        },
        response: {}

      });
    }

    if (!newHistory) {
      return res.status(400).json({
        messages: {
          code: 1,
          message: "Transaction history not found",
        },
        response: {}

      });
    }

    return res.status(200).json({
      messages: {
        code: 0,
        message: "Wallet updated",
      },
      response: { wallet }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messages: {
        code: 1,
        message: "Internal server error",
      },
      response: {}

    });
  }
};

export const getTransactionHistories = async (req: express.Request, res: express.Response) =>{
  try{
    const id = req.params.id;

    const transactionHistories = await findTransactionHistories(id);
    return res.status(200).json({
      messages: {
        code: 0,
        message: "User transaction histories retrieved"
      },
      response: transactionHistories
    })

  }catch(error){
    console.log(error)
  }
}
