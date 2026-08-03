import express from "express";
import { chatResponse } from "../Controllers/chatController.js";


const chatRouter = express.Router();


chatRouter.post(
    "/",
    chatResponse
);


export default chatRouter;