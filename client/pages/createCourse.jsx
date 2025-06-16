import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateCourses = () => {
  const [mycourses, setMycourses] = useState([]);
  const [addState, setAddState] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchmyCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/course/bulk", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMycourses(res.data.allCourses);
      } catch (e) {
        console.error(e);
      }
    };
    fetchmyCourses();
  }, [token]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Your Courses</h2>
        <button
          type="button"
          className="bg-[#4040C1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2e2ea1] transition"
          onClick={() => setAddState(true)}
        >
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(mycourses) &&
          mycourses.map((course, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-5 border transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg cursor-pointer flex flex-col"
            >
              <h3 className="text-xl font-bold mb-3">{course.title}</h3>

              <p className="text-gray-700 mb-1">
                <strong>Creator ID: </strong> {course.creatorId}
              </p>

              <p className="text-gray-500 mb-1">
                <strong>Description: </strong> {course.description}
              </p>
              <p className="text-gray-500 mb-3">
                <strong>Level: </strong> {course.level}
              </p>
              <p className="text-gray-500 mb-3">
                <strong>Topic: </strong> {course.topic}
              </p>

              <p className="text-gray-600 mb-4 font-bold text-xl text-right">
                ₹{course.price}
              </p>

              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-auto">
                <button
                  className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition"
                  onClick={() => alert("Edit clicked!")}
                >
                  Edit
                </button>
                <button className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition">
                  Remove
                </button>
              </div>
            </div>
          ))}
      </div>

      {addState && <ModalAddState onClose={() => setAddState(false)} />}
    </div>
  );
};

function ModalAddState({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/user/create-course",
        { title, description, price: Number(price), topic, level },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(res.data.msg || "Course created successfully");
      onClose();
      console.log(res.data);
    } catch (err) {
      setMessage(
        err.response?.data?.msg || "Course creation failed. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <button
          className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-black"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center">New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              placeholder="Enter title"
              className="border border-gray-300 rounded px-4 py-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              placeholder="Description..."
              className="border border-gray-300 rounded px-4 py-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              placeholder="Price..."
              className="border border-gray-300 rounded px-4 py-2 w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Topic</label>
            <input
              type="text"
              placeholder="Topic..."
              className="border border-gray-300 rounded px-4 py-2 w-full"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Level</label>
            <input
              type="text"
              placeholder="Level..."
              className="border border-gray-300 rounded px-4 py-2 w-full"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2fa956] text-black py-3 rounded-lg font-medium hover:bg-[#249a45] transition"
          >
            Create
          </button>

          {message && (
            <p className="text-center mt-3 text-sm text-black">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateCourses;
