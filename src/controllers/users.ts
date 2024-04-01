import express from "express";
import bcrypt from "bcrypt";
import moment from "moment";
import mongoose from "mongoose";
import { createWallet, updateWallet, getWallet } from "../services/wallet";
import { createTransactionHistory } from "../services/transactionHistory";

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
        message: {
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
  // const { email } = req.params;
  const id = req.params.id;

  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const user = await getUserById(objectId);

    console.log(objectId);
    console.log(user);

    if (!user) {
      return res.status(400).json({
        messages: {
          code: 1,
          message: "User not found",
          timestamp: true,
        },
        response: {}

      });
    }

    const updatedUser = await updateUser(user._id, req.body);

    console.log(user);
    console.log(user._id);
    console.log(req.body);
    console.log(updatedUser);

    return res.status(200).json({
      messages: {
        code: 0,
        message: "User updated"
      },
      response: { updatedUser }

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

export const updateBalance = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;
  const { balance } = req.body;
  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const user = await getUserById(objectId);
    const beforeBalance = await getWallet(id);
    const wallet = await updateWallet(id, balance);

    const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`;

    const newHistory = await createTransactionHistory(
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
