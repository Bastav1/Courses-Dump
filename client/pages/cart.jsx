import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/cart/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched Cart: ", res.data);
        setCart(res.data.allCartElements);
      } catch (e) {
        console.error("Error fetching cart:", e);
      }
    };
    fetchCart();
  }, []);

  const removeFromCart = async (idToRemove) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/user/cart/remove/${idToRemove}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);
      setCart((prevCart) => prevCart.filter((item) => item._id !== idToRemove));
    } catch (e) {
      console.error("Failed to remove item from cart:", e);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((c, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-5 border transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg cursor-pointer flex flex-col"
            >
              <h3 className="text-xl font-bold mb-3">{c.title}</h3>
              <p className="text-gray-700 mb-1">
                <strong>Creator ID:</strong> {c.creatorId}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Creator Name:</strong> {c.creatorName}
              </p>
              <p className="text-gray-500 mb-1">
                <strong>Description:</strong> {c.description}
              </p>
              <p className="text-gray-500 mb-3">
                <strong>Level:</strong> {c.level}
              </p>
              <p className="text-gray-500 mb-3">
                <strong>Topic: </strong> {c.topic}
              </p>
              <p className="text-gray-600 mb-4 flex justify-end font-bold text-xl">
                <strong>₹{c.price}</strong>
              </p>
              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-auto">
                <button
                  className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition cursor-pointer"
                  onClick={() => removeFromCart(c._id)}
                >
                  Remove
                </button>
                <button className="bg-[#4040C1] text-white py-2 px-4 rounded hover:bg-[#2e2ea1] transition cursor-pointer">
                  Buy now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
