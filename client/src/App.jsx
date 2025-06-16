import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "../pages/home";
import Courses from "../pages/courses";
import CreateCourses from "../pages/createCourse";
import Cart from "../pages/cart";
import NavBar from "../components/NavBar";
import Footer from "../components/footer";

function App() {
  const [logged_or_Signed, setlogged_or_Signed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setlogged_or_Signed(true);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <NavBar
            isLogged={logged_or_Signed}
            setIsLogged={setlogged_or_Signed}
          />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Courses />}></Route>
              <Route path="/createCourses" element={<CreateCourses />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
