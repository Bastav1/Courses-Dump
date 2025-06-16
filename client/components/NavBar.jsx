import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const NavBar = ({ isLogged, setIsLogged }) => {
  return (
    <nav className="bg-[#A14545] p-4">
      {isLogged ? (
        <LoggedInNav setIsLogged={setIsLogged} />
      ) : (
        <GuestNav setIsLogged={setIsLogged} />
      )}
    </nav>
  );
};

const LoggedInNav = ({ setIsLogged }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 font-custom">
      <Link
        to="/"
        className="font-bold text-3xl sm:text-4xl tracking-[-0.08em]"
      >
        COURSIFY
      </Link>
      <div className="flex flex-wrap items-center gap-4 text-lg sm:text-2xl">
        <Link
          to="/createCourses"
          className="flex items-center text-[#10107B] font-bold tracking-[-0.08em] "
        >
          Create Courses{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </Link>
        <Link to="/" className="font-medium tracking-[-0.05em]">
          Explore
        </Link>
        <Link
          to="/Cart"
          className="flex items-center font-medium tracking-[-0.05em]"
        >
          Cart{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </Link>
        <div className="tracking-[-0.05em]">
          Hello, {localStorage.getItem("Name")}
        </div>
        <div
          className="cursor-pointer font-medium tracking-[-0.06em]"
          onClick={() => {
            if (confirm("Are you sure you want to log out?")) {
              localStorage.removeItem("token");
              localStorage.removeItem("Name");
              setIsLogged(false);
            }
          }}
        >
          Log Out
        </div>
      </div>
    </div>
  );
};

const GuestNav = ({ setIsLogged }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 font-custom">
      <Link to="/" className="font-bold text-3xl sm:text-4xl">
        COURSIFY
      </Link>
      <div className="flex flex-wrap items-center gap-4 text-lg sm:text-xl">
        <Link to="/Courses" className="font-medium">
          Explore
        </Link>
        <SignIn setIsLogged={setIsLogged} />
        <LogIn setIsLogged={setIsLogged} />
      </div>
    </div>
  );
};

function SignIn() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className="cursor-pointer bg-[#4040C1] text-black px-4 py-2 rounded-lg font-medium text text-center"
        onClick={() => setShowModal(true)}
      >
        Join for Free!
      </div>
      {showModal && (
        <ModalSignIn
          onClose={() => setShowModal(false)}
          onSigninSuccess={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}

function ModalSignIn({ onClose, onSigninSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/signup", {
        email,
        password,
        firstName,
        lastName,
      });
      setMessage(res.data.msg || "Signin successful");
      onSigninSuccess();
      onClose();
    } catch (err) {
      setMessage(err.response?.data?.msg || "Signin failed. Please try again.");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative">
        <button
          className="absolute top-2 cursor-pointer right-3 text-xl font-bold text-gray-600 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="text"
              placeholder="Enter email"
              className="border border-gray-300 rounded px-4 py-2"
              required
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="border border-gray-300 rounded px-4 py-2"
              required
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>

          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-2"
              required
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
          </div>

          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-2"
              required
              onChange={(e) => setLastName(e.target.value)}
            ></input>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4040C1] text-white px-4 py-2 rounded-lg font-medium"
          >
            Submit
          </button>
          {message && (
            <p className="text-center mt-2 text-sm text-black">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

function LogIn() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className="cursor-pointer font-medium"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Log In
      </div>
      {showModal && <ModalLogIn onClose={() => setShowModal(false)} />}
    </>
  );
}

function ModalLogIn({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/signin", {
        email,
        password,
      });
      setMessage(res.data.msg || "Login successful");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("Name", res.data.firstName);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl relative">
        <button
          className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="border border-gray-300 rounded px-4 py-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="border border-gray-300 rounded px-4 py-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4040C1] text-white px-4 py-2 rounded-lg font-medium"
          >
            Submit
          </button>
        </form>
        {message && (
          <p className="text-center mt-2 text-sm text-black">{message}</p>
        )}
      </div>
    </div>
  );
}

export default NavBar;
