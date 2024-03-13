import express from "express";
import { getToken } from "../controllers/token";
import { isAuthorized } from "../middlewares/index";

export default (router: express.Router) => {
    router.get('/getToken', isAuthorized, getToken);
}