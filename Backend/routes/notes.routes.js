// import express from "express";
// import authMiddleware from "../middlewares/auth.middleware.js";
// import upload from "../middlewares/multer.middleware.js";
// import {
//   addNewNotes,
//   addNotes,
//   deleteNotes,
//   getMentorsNotes,
//   getNoteTitleById,
//   getOwnNotes,
//   getSingleNote,
//   updateNotes,
// } from "../controllers/notes.controllers.js";
// const router = express.Router();

// router.post("/", authMiddleware, addNotes);
// router.post("/create", authMiddleware, addNewNotes);
// router.put("/:id", authMiddleware, upload.single("videoNote"),updateNotes);
// router.delete("/:id", authMiddleware, deleteNotes);
// router.get("/own", authMiddleware, getOwnNotes);
// router.get("/mentors", authMiddleware, getMentorsNotes);
// router.get("/:id", authMiddleware, getSingleNote);
// router.get("/title/:id", authMiddleware, getNoteTitleById);

import express from 'express';
import { addNote, deleteNoteAndCollections, getMentorsNotes, getOwnNotes, getSingleNote, updateNote } from '../controllers/notes.controllers.js';
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post('/:id', addNote);
router.get('/:id',getSingleNote);
router.get('/own/:id',getOwnNotes);
router.put('/:id',updateNote);
router.get('/mentors/:id', getMentorsNotes);
router.delete("/:id",authMiddleware,deleteNoteAndCollections);




export default router;
