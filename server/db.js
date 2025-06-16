const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  creatorId: ObjectId,
  creatorName:String,
  level:String,
  topic:String,
  creatorName:String
});

const purchaseSchema = new Schema({
  userId: ObjectId,
  courseId: ObjectId,
});

const topicSchema = new Schema({
  courseId: ObjectId,
  topic: String,
});

const levelSchema = new Schema({
  topicId: ObjectId,
  courseId: ObjectId,
  level: String,
});
const cartSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  topic: String,
  level: String,
  userId: ObjectId,
});

const userModel = mongoose.model("user", userSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);
const topicModel = mongoose.model("topic", topicSchema);
const levelModel = mongoose.model("level", levelSchema);
const cartModel = mongoose.model("cart", cartSchema);

module.exports = {
  userModel,
  courseModel,
  purchaseModel,
  topicModel,
  levelModel,
  cartModel,
};
