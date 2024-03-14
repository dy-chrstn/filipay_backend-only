// require("dotenv").config();
import basicAuth from "express-basic-auth";
import { getToken } from "../services/token";
import express from "express";

export const isAuthorized = basicAuth({
  authorizeAsync: true,
  authorizer: async (username: string, password: string, cb: any) => {
    try {
      if (
        username === process.env.USERNAME &&
        password === process.env.PASSWORD
      ) {
        return cb(null, true);
      } else {
        return cb(null, false, { message: "Invalid credentials", status: 401 });
      }
    } catch (error) {
      return cb(error);
    }
  },
  challenge: true, // Sends a 401 Unauthorized response automatically
  unauthorizedResponse: () => {
    return {
      code: 1,
      message: "Unauthorized",
    };
  },
});

export const tokenAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ code: 1, message: "Unauthorized access", status: 401 });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ code: 1, message: "Bearer token is missing", status: 401 });
  }

  try {
    const existingToken = await getToken(token);

    if (!existingToken) {
      return res
        .status(401)
        .json({ code: 1, message: "Token no similarities", status: 401 });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ code: 1, message: "Invalid token", status: 401, token: token });
  }
};

export const checkCredentials = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileNumberRegex = /^(09|\+639)\d{9}$/;
  const passwordRegex = /^.{8,}$/;

  if (emailRegex.test(email)) {
    if (!passwordRegex.test(password)) {
      return res
        .status(401)
        .json({ code: 1, message: "Invalid email or password", status: 401 });
    }
  } else if (mobileNumberRegex.test(email)) {
    if (!passwordRegex.test(password)) {
      return res
        .status(401)
        .json({ code: 1, message: "Invalid email or password", status: 401 });
    }
  } else {
    return res
      .status(401)
      .json({ code: 1, message: "Invalid email or password", status: 401 });
  }

  next();
};
