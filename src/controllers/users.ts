import express from "express";
import bcrypt from "bcrypt";
import moment from "moment";
import mongoose from "mongoose";
import { createWallet, updateWallet } from "../services/wallet";

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
        code: 1,
        message: "Email and password are required",
        timestamp: timestamp,
      });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        code: 1,
        message: "User not found",
        timestamp: timestamp,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.status(200).json({
        code: 0,
        message: "User logged in successfully",
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        address: user.address,
        birthday: user.birthday,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } else {
      return res.status(400).json({
        code: 1,
        message: "Invalid password",
        timestamp: timestamp,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 1,
      message: "Internal server error",
      timestamp: timestamp,
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
    } = req.body;

    if (!email || !password) {
      return res.sendStatus(400).json({
        code: 1,
        message: "Email and password are required",
        timestamp: true,
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
    };

    try {
      const user = await createUser(newUser);

      const wallet = await createWallet(user._id);

      return res.status(200).json({
        code: 0,
        message: "User created",
        user,
        wallet,
      });
    } catch (error) {
      console.log("Error creating user: ", error);
      return res.sendStatus(400).json({
        code: 1,
        message: "Error creating user",
        timestamp: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).json({
      code: 1,
      message: "Internal server error",
      timestamp: true,
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
        code: 1,
        message: "User not found",
        timestamp: true,
      });
    }

    const updatedUser = await updateUser(user._id, req.body);

    console.log(user);
    console.log(user._id);
    console.log(req.body);
    console.log(updatedUser);

    return res.status(200).json({
      code: 0,
      message: "User updated",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 1,
      message: "Internal server error",
      timestamp: true,
    });
  }
};

export const updateBalance = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  const { balance } = req.body;
  try {
    // const objectId = new mongoose.Types.ObjectId(id);
    const wallet = await updateWallet(id, balance);

    console.log('id: ', id);
    console.log('balance: ', balance);
    console.log('wallet: ', wallet);

    if(!wallet ){
      return res.status(400).json({
        code: 1,
        message: "Wallet not found",
        timestamp: true,
      });
    }

    return res.status(200).json({
      code: 0,
      message: "Wallet updated",
      wallet,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 1,
      message: "Internal server error",
      timestamp: true,
    });
  }
};
