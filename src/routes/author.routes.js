import express from 'express';
import {findBookAuthors, removeAuthor} from "../controllers/author.controller.js";

const router = express.Router();

router.get('/authors/book/:isbn', findBookAuthors);
router.delete('/author/:author', removeAuthor);

export default router;