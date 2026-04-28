import express from "express";
import {findPublishersByAuthor} from "../controllers/publisher.controller.js";

const router = express.Router();

router.get('/publishers/author/:author', findPublishersByAuthor);

export default router;
