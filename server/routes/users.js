const express = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const userRouter = require("express").Router();
const {
  userModel,
  purchaseModel,
  courseModel,
  topicModel,
  cartModel,
  levelModel,
} = require("../db");
const { JWT_USER } = require("../config");
const { userMiddleware } = require("../middlewares/users");
userRouter.use(express.json());

//signup
userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().email(),
    password: z.string().max(20),
    firstName: z.string().max(20),
    lastName: z.string().max(20),
  });
  const parsedData = requiredBody.safeParse(req.body);
  if (!parsedData.success) {
    return res.json({
      msg: "incorrect format",
      success: false,
      errors: parsedData.error.errors,
    });
  }
  const { email, password, firstName, lastName } = parsedData.data;
  const isPresent = await userModel.findOne({ email });

  if (isPresent) {
    return res.json({ msg: "User already exists!" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    res.json({ msg: "User created successfully!", success: true });
  } catch (e) {
    res.status(500).json({ msg: "Sign up failed!", success: false });
  }
});

//signin
userRouter.post("/signin", async (req, res) => {
  const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().max(20),
  });

  const parsedData = signinSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      msg: "Invalid email or password format",
      success: false,
      errors: parsedData.error.errors,
    });
  }
  const { email, password } = parsedData.data;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "User not found!", success: false });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(
        { id: user._id, userName: user.firstName },
        JWT_USER,
        { expiresIn: "1d" }
      );

      res.json({
        msg: "Signed in!",
        token: token,
        success: true,
        firstName: user.firstName,
      });
    } else {
      res
        .status(404)
        .json({ msg: "invalid user email or password", success: false });
    }
  } catch (e) {
    res.status(500).send({ msg: "Error!" });
  }
});

//course purchasing router...
userRouter.post("/purchase", userMiddleware, async (req, res) => {
  const purchaseSchema = z.object({
    item: z.string().max(100),
  });

  const parsed = purchaseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ msg: "Invalid purchase format" });
  }
  const userId = req.userId;
  const { item } = parsed.data;
  const isThere = await courseModel.findOne({ title: item });
  if (!isThere) {
    return res.json({ msg: "No such course exists" });
  }
  const courseId = isThere._id;
  try {
    const alreadyPurchased = await purchaseModel.findOne({ userId, courseId });
    if (alreadyPurchased) {
      return res.status(400).json({ msg: "Course already purchased" });
    }
    await purchaseModel.create({
      userId,
      courseId,
    });
    res.status(200).json({ msg: "Course purchases succesfully!" });
  } catch (e) {
    res.status(500).json({ msg: "Error in purchasing course!" });
  }
});

//course list
userRouter.get("/courseList", async (req, res) => {
  try {
    const courses = await courseModel.find();
    const all_courses = courses.map((c) => ({
      title: c.title,
      description: c.description,
      price: c.price,
      creatorId: c.creatorId,
      level: c.level,
      creatorName: c.creatorName,
    }));
    res.json({ courses: all_courses });
  } catch (e) {
    res.status(500).json({ msg: "Error retrieving data" });
  }
});

//purchases list...
userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const purchases = await purchaseModel.find({ userId }).populate("courseId");
    if (purchases.length == 0) {
      return res.json({ msg: "No purchases yet!" });
    }
    res.status(200).json({ purchases: purchases });
  } catch (e) {
    res.status(500).json({ msg: "Error in getting purchases!" });
  }
});

//advance
userRouter.get("/level/advance", userMiddleware, async (req, res) => {
  try {
    const advanceLevels = await levelModel.find({ level: "advance" });
    const courseIds = advanceLevels.map((level) => level.courseId);
    const advanceCourses = await courseModel.find({ _id: { $in: courseIds } });
    const topics = await topicModel.find({ courseId: { $in: courseIds } });

    res.json({
      advanceCourses,
      advanceTopics: topics,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error" });
  }
});

//medium
userRouter.get("/level/medium", userMiddleware, async (req, res) => {
  try {
    const mediumLevels = await levelModel.find({ level: "medium" });
    const courseIds = mediumLevels.map((level) => level.courseId);
    const mediumCourses = await courseModel.find({ _id: { $in: courseIds } });
    const topics = await topicModel.find({ courseId: { $in: courseIds } });

    res.json({
      mediumCourses,
      mediumTopics: topics,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error" });
  }
});

//easy
userRouter.get("/level/easy", userMiddleware, async (req, res) => {
  try {
    const easyLevels = await levelModel.find({ level: "easy" });
    const courseIds = easyLevels.map((level) => level.courseId);
    const easyCourses = await courseModel.find({ _id: { $in: courseIds } });
    const topics = await topicModel.find({ courseId: { $in: courseIds } });

    res.json({
      easyCourses,
      easyTopics: topics,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error" });
  }
});

//Cart
//add_to_cart...
userRouter.post("/add/cart", userMiddleware, async (req, res) => {
  const { title, description, price, topic, level } = req.body;
  const userId = req.userId;
  const found = await cartModel.findOne({ title, description, userId });
  if (found) return res.json({ msg: "Already present" });
  try {
    const cartEl = await cartModel.create({
      title,
      description,
      price,
      topic,
      level,
      userId,
    });
    res.status(200).json({
      msg: "Added to cart!",
    });
  } catch (e) {
    res.status(500).json({ msg: "Error!" });
  }
});
//delete from cart after bought
userRouter.delete("/cart/remove/:id", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const cartItemId = req.params.id;
  try {
    const deletedCourse = await cartModel.findOneAndDelete({
      _id: cartItemId,
      userId,
    });

    if (!deletedCourse) {
      return res.status(404).json({ message: "Not found" });
    }
    res
      .status(200)
      .json({ message: "Course deleted successfully", course: deletedCourse });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//get all the cart elements
userRouter.get("/cart/all", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const allCartElements = await cartModel.find({ userId });
    res.json({ allCartElements });
  } catch (e) {
    res.status(500).json({ msg: "Error" });
  }
});

//creating courses...
userRouter.post("/create-course", userMiddleware, async (req, res) => {
  const signinSchema = z.object({
    title: z.string().max(50),
    description: z.string().max(20),
    price: z.number().positive(),
    topic: z.string().max(50),
    level: z.string().max(20),
  });

  const parsedData = signinSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ msg: "Invalid course format" });
  }
  const userId = req.userId;
  const userName = req.userName;
  const { title, description, price, topic, level } = req.body;
  try {
    const course = await courseModel.create({
      title,
      description,
      price,
      creatorId: userId,
      topic,
      level,
      creatorName: userName,
    });
    const topicDoc = await topicModel.create({
      courseId: course._id,
      topic,
    });
    const levelDoc = await levelModel.create({
      level,
      courseId: course._id,
      topicId: topicDoc ? topicDoc._id : null,
    });
    res.json({
      msg: "Course created",
      courseId: course._id,
      title,
      description,
      price,
      topic,
      level,
      creatorName: userName,
    });
  } catch (e) {
    res.status(500).json({ msg: "Error in creating course!" });
    console.log(e);
  }
});

//course updation...
userRouter.put("/update-course", userMiddleware, async (req, res) => {
  const signinSchema = z.object({
    title: z.string().max(50),
    description: z.string().max(200),
    price: z.number().positive(),
    courseId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid course ID",
    }),
  });

  const parsedData = signinSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ msg: "Invalid course format" });
  }
  const userId = req.userId;
  const { title, description, price, courseId } = req.body;
  try {
    const updateResult = await courseModel.updateOne(
      { _id: courseId, creatorId: userId },
      { title, description, price }
    );
    if (updateResult.modifiedCount === 0) {
      return res
        .status(404)
        .json({ msg: "No changes were made or course not found.." });
    }
    const updatedCourse = await courseModel.findById(courseId);
    res.json({
      msg: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (e) {
    res.status(500).json({ msg: "Error in updation!" });
  }
});

//get all courses created...
userRouter.get("/course/bulk", userMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const results = await courseModel.find({ creatorId: userId });
    const allCourses = results.map((courses) => courses);
    res.json({ allCourses });
  } catch (e) {
    res.status(500).json({ msg: "Error!" });
  }
});

module.exports = {
  userRouter,
};
