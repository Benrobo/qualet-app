import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

function SideBar({ active }) {
  return (
    <React.Fragment>
      <div className={`relative h-screen w-[250px] bg-dark-200 p-3`}>
        <ul className="w-full mt-5 flex flex-col items-center justify-start">
          <Link to="/dashboard" className="w-full">
            <li
              className={`w-full px-4 py-3 font-extrabold rounded-md cursor-pointer text-[13px] ${
                active === "dashboard"
                  ? "bg-dark-100 text-white-100"
                  : "bg-dark-200 text-white-200"
              }`}
            >
              Overview
            </li>
          </Link>
          <Link to="/transactions" className="w-full">
            <li
              className={`w-full mt-4 px-4 py-3 font-extrabold rounded-md cursor-pointer text-[13px] ${
                active === "transactions"
                  ? "bg-dark-100 text-white-100"
                  : "bg-dark-200 text-white-200"
              }`}
            >
              Transactions
            </li>
          </Link>
          <Link to="/products" className="w-full">
            <li
              className={`w-full mt-4 px-4 py-3 font-extrabold rounded-md cursor-pointer text-[13px] ${
                active === "products"
                  ? "bg-dark-100 text-white-100"
                  : "bg-dark-200 text-white-200"
              }`}
            >
              Products
            </li>
          </Link>
          <Link to="/settings" className="w-full">
            <li
              className={`w-full mt-4 px-4 py-3 font-extrabold rounded-md cursor-pointer text-[13px] ${
                active === "settings"
                  ? "bg-dark-100 text-white-100"
                  : "bg-dark-200 text-white-200"
              }`}
            >
              Settings
            </li>
          </Link>
        </ul>
      </div>
    </React.Fragment>
  );
}

export default SideBar;
