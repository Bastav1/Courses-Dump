import { useState, useEffect } from "react";
import axios from "axios";

async function Addcart(title, description, price, topic, level, Id) {
  try {
    const res = await axios.post(
      "http://localhost:5000/user/add/cart",
      {
        title,
        description,
        price,
        topic,
        level,
        creatorId: Id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    alert(res.data.msg);
  } catch (e) {
    console.log(e);
  }
}

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/courseList");
        setCourses(res.data.courses);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCourses();
  }, [localStorage.getItem("token")]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">All Courses</h2>
        <input
          type="text"
          placeholder="Search Topics.."
          className="px-3 py-2 border rounded w-full sm:w-64"
          onChange={(e) => {
            setSearchItem(e.target.value);
          }}
        />
      </div>
      {searchItem && <Searched courses={courses} searchItem={searchItem} />}
      {!searchItem && <NotSearched courses={courses} />}
    </div>
  );
};

export default Courses;

//searched...
const Searched = ({ courses, searchItem }) => {
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchItem.toLowerCase()) ||
      course.description.toLowerCase().includes(searchItem.toLowerCase())
  );

  if (filteredCourses.length === 0) {
    return (
      <p className="text-center text-3xl font-bold text-gray-500">
        No courses match your search.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map((course, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-2xl p-5 border transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer flex flex-col"
        >
          <h3 className="text-xl font-bold mb-3">{course.title}</h3>
          <p className="text-gray-700 mb-1">
            <strong>Creator ID:</strong> {course.creatorId}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Creator Name:</strong> {course.creatorName}
          </p>
          <p className="text-gray-500 mb-1">
            <strong>Description:</strong> {course.description}
          </p>
          <p className="text-gray-500 mb-3">
            <strong>Level:</strong> {course.level}
          </p>
          <p className="text-gray-500 mb-3">
            <strong>Topic: </strong> {course.topic}
          </p>
          <p className="text-gray-600 mb-4 font-bold text-xl text-right">
            ₹{course.price}
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-auto">
            <button className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition">
              View
            </button>
            <button className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition">
              Buy Now
            </button>
            <button
              className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition"
              onClick={() =>
                Addcart(
                  course.title,
                  course.description,
                  course.price,
                  course.topic,
                  course.level,
                  course.creatorId
                )
              }
            >
              Add to cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

//not searched...
const NotSearched = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-2xl p-5 border transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer flex flex-col"
        >
          <h3 className="text-xl font-bold mb-3">{course.title}</h3>

          <p className="text-gray-700 mb-1">
            <strong>Creator ID:</strong> {course.creatorId}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Creator Name:</strong> {course.creatorName}
          </p>
          <p className="text-gray-500 mb-1">
            <strong>Description:</strong> {course.description}
          </p>
          <p className="text-gray-500 mb-3">
            <strong>Level:</strong> {course.level}
          </p>
          <p className="text-gray-600 mb-4 font-bold text-xl text-right">
            ₹{course.price}
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-auto">
            <button className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition">
              View
            </button>
            <button className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition">
              Buy Now
            </button>
            <button
              className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition"
              onClick={() =>
                Addcart(
                  course.title,
                  course.description,
                  course.price,
                  course.topic,
                  course.level,
                  course.creatorId
                )
              }
            >
              Add to cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
