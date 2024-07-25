import { validationResult } from "express-validator";
import UserModels from "../models/User.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }

  const { name, email, password, userType } = req.body;

  try {
    let user = await UserModels.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new UserModels({
      name,
      email,
      password,
      userType,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      userId: user._id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRECT,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await UserModels.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      userId: user._id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRECT,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModels.findById(req.userId)
      .select("-password")
      .populate("mentors", "-password");

    if (!user) res.status(401).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getMentors = async (req, res) => {
  try {
    const mentors = await UserModels.find({ userType: "mentor" }).select(
      "-password"
    );
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const addMentors = async (req, res) => {
  const { mentorIds } = req.body;

  if (!Array.isArray(mentorIds)) {
    return res.status(400).json({ msg: "mentorIds should be an array" });
  }

  try {
    const user = await UserModels.findById(req.userId);
    const validMentorIds = [];

    for (let mentorId of mentorIds) {
      const mentor = await UserModels.findById(mentorId);

      if (!mentor || mentor.userType !== "mentor") {
        return res.status(400).json({ msg: `Invalid mentor ID: ${mentorId}` });
      }

      if (!user.mentors.includes(mentorId)) {
        validMentorIds.push(mentorId);
      }
    }

    if (validMentorIds.length === 0) {
      return res.status(400).json({ msg: "No valid new mentors to add" });
    }

    user.mentors = user.mentors.concat(validMentorIds);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const removeMentor = async (req, res) => {
  const { mentorId } = req.params;

  try {
    console.log("Mentor ID:", mentorId);

    const user = await UserModels.findById(req.userId);
    console.log("User before removing mentor:", user);

    // Check if the mentor exists in the user's mentors list
    if (!user.mentors.includes(mentorId)) {
      return res.status(400).json({ msg: "Mentor not found in your profile" });
    }

    // Remove the mentor from the user's mentors list
    user.mentors = user.mentors.filter(
      (mentor) => mentor.toString() !== mentorId
    );
    console.log("User after removing mentor:", user);

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
