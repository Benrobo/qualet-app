import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Input } from "../components/UI-COMP";
import API_ROUTES from "../config/apiRoutes";
import DataContext from "../context/DataContext";

import { Notification, sleep, validateEmail } from "../helpers/";
import Fetch from "../helpers/fetch";

const notif = new Notification(6000);

function Authentication() {
  const { isAuthenticated } = useContext(DataContext)
  const [activeForm, setActiveForm] = useState("login");
  const [loading, setLoading] = useState(false);

  const toggleActiveForm = (form = "login") => setActiveForm(form);

  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} />
  }

  async function AuthenticateUser(
    type,
    payload = { email: "", username: "", password: "" }
  ) {
    if (type === "login") {
      const { email, password } = payload;

      if (email === "") return notif.error("email cant be empty");
      if (password === "") return notif.error("password cant be empty");
      if (!validateEmail(email)) return notif.error("Email given is invalid");

      try {
        // login user
        setLoading(true);
        const { res, data } = await Fetch(API_ROUTES.login, {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        });

        setLoading(false);

        if (data && data?.success === false) {
          return notif.error(data?.message);
        }

        notif.success(data?.message);
        const result = data?.data;
        localStorage.setItem(
          "authToken",
          JSON.stringify({ accessToken: result?.accessToken })
        );
        localStorage.setItem("qualet", JSON.stringify(result));

        await sleep(2);
        window.location = "/dashboard";
      } catch (e) {
        setLoading(false);
        notif.error("Something went wrong logging In.")
        console.log(e.message);
      }
    }

    if (type === "signup") {
      const { email, username, password, phonenumber } = payload;

      if (username === "") return notif.error("username cant be empty");
      if (email === "") return notif.error("email cant be empty");
      if (phonenumber === "") return notif.error("phonenumber cant be empty");
      if (password === "") return notif.error("password cant be empty");
      if (!validateEmail(email)) return notif.error("Email given is invalid");

      try {
        // login user
        setLoading(true);
        const { res, data } = await Fetch(API_ROUTES.register, {
          method: "POST",
          body: JSON.stringify({
            username,
            email,
            phonenumber,
            password,
          }),
        });

        setLoading(false);

        if (data && data?.success === false) {
          return notif.error(data?.message);
        }

        notif.success(data?.message);
        toggleActiveForm("login");
        await sleep(1);
      } catch (e) {
        setLoading(false);
        notif.error("Something went wrong registering.")
        console.log(e.message);
      }
    }
  }

  return (
    <div className="w-full h-screen bg-dark-300">
      <div className="w-full h-screen flex flex-col items-start justify-center">
        {activeForm === "login" ? (
          <LoginForm
            loading={loading}
            AuthenticateUser={AuthenticateUser}
            toggleActiveForm={toggleActiveForm}
          />
        ) : (
          <SignupForm
            loading={loading}
            AuthenticateUser={AuthenticateUser}
            toggleActiveForm={toggleActiveForm}
          />
        )}
      </div>
    </div>
  );
}

export default Authentication;

function LoginForm({ toggleActiveForm, AuthenticateUser, loading }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // console.log({ name, value });
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-[400px] h-auto bg-white-200 mx-auto shadow-lg rounded-md shadow-dark-400 p-4  ">
      <div id="head" className="w-full h-auto">
        <p className="text-dark-100 text-[20px] font-extrabold ">
          Login to your account.
        </p>
      </div>
      <br />
      <Input
        placeholder="Email"
        type="email"
        name="email"
        onChange={handleInputs}
      />
      <br />
      <Input
        placeholder="Password"
        type="password"
        name="password"
        onChange={handleInputs}
      />
      <br />
      <br />
      <div className="w-full flex flex-row items-center justify-between gap-5">
        <Button
          type="secondary"
          text={`${loading ? "Logging In" : "Login"}`}
          long={true}
          style={{ padding: "10px" }}
          onClick={() => AuthenticateUser("login", inputs)}
        />
      </div>
      <br />
      <small className="text-dark-100 font-extrabold">
        Dont have an account ?{" "}
        <a
          className="text-dark-100 underline cursor-pointer"
          onClick={() => toggleActiveForm("signup")}
        >
          Create one
        </a>
      </small>
    </div>
  );
}

function SignupForm({ toggleActiveForm, AuthenticateUser, loading }) {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
  });

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // console.log({ name, value });
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-[400px] h-auto bg-white-200 mx-auto shadow-lg rounded-md shadow-dark-400 p-4  ">
      <div id="head" className="w-full h-auto">
        <p className="text-dark-100 text-[20px] font-extrabold ">
          Register an account.
        </p>
      </div>
      <br />
      <Input
        type="text"
        name="username"
        onChange={handleInputs}
        placeholder="Username"
      />
      <br />
      <Input
        type="email"
        name="email"
        onChange={handleInputs}
        placeholder="Email"
      />
      <br />
      <Input
        type="number"
        name="phonenumber"
        onChange={handleInputs}
        placeholder="Phonenumber"
      />
      <br />
      <Input
        type="password"
        name="password"
        onChange={handleInputs}
        placeholder="Password"
      />
      <br />
      <br />
      <div className="w-full flex flex-row items-center justify-between gap-5">
        <Button
          type="secondary"
          text={`${loading ? "Creating Account..." : "Create Account"}`}
          long={true}
          style={{ padding: "10px" }}
          onClick={() => AuthenticateUser("signup", inputs)}
        />
      </div>
      <br />
      <small className="text-dark-100 font-extrabold">
        Have an account ?{" "}
        <a
          className="text-dark-100 underline cursor-pointer"
          onClick={() => toggleActiveForm("login")}
        >
          Log In
        </a>
      </small>
    </div>
  );
}
