import express from "express";
import { registerInput } from "../middlewares/inputValidation.js";
import {
    addMentors,
  getMentors,
  getProfile,
  login,
  register,
  removeMentor,
} from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { check } from "express-validator";
const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.get("/mentors", authMiddleware, getMentors);
router.post("/login", login);
router.post("/register", registerInput, register);
router.put(
  "/add-mentor",
  [authMiddleware, check("mentorId", "Mentor ID is required").not().isEmpty()],
  addMentors
);

router.delete('/mentors/:mentorId', authMiddleware, removeMentor);

export default router;
