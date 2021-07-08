import React, { useContext, useState } from "react";
import "./Login.css";
import userIcon from "../assets/user.png";
import lockIcon from "../assets/lock.png";
import { useHistory } from "react-router-dom";
import { useLoginMutation } from "../graphql/generated/graphql";
import { useSnackBar } from "../context/SnackBarContext";
import { useForm } from "../util/useForm";
import { useApolloClient } from "@apollo/client";
import { writeToken } from "../util/readAndWriteToken";
import { UserContext } from "../context/UserContext";

interface Credentials {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const [credentials, setCredentials] = useForm<Credentials>({
    email: "",
    password: "",
  });
  const history = useHistory();
  const { dispatch } = useSnackBar();
  const client = useApolloClient();
  const {setUser} = useContext(UserContext);

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [login] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      dispatch({ type: "loading" });
      const response = await login({
        variables: {
          email: credentials.email,
          password: credentials.password,
        },
      });

      const errors = response.data?.login?.errors;
      console.log(response.errors)

      if (errors) {
        dispatch({ type: "error", error: "Wrong email or password" });
        return;
      }

      dispatch({ type: "successful" });

      writeToken(client, response.data?.login?.accessToken!);

      console.log(client.cache);

      setUser!(response.data?.login?.user!);
      
      history.push("/");
    }
  };

  

  const validateForm = (): boolean => {
    let valid = true;

    if (credentials.email.trim().length === 0) {
      setEmailError("Email field is empty");
      valid = false;
    } else setEmailError("");
    if (credentials.password.trim().length === 0) {
      setPasswordError("Password field is empty");
      valid = false;
    } else setPasswordError("");

    return valid;
  };

  return (
    <div id="login-container" className="container">
      <h1>Login</h1>
      <form id="login-form" onSubmit={handleSubmit}>
        <div>
          <div className="icon-input-container">
            <img className="input-icon" src={userIcon} alt="user icon" />
            <input
              name="email"
              value={credentials.email}
              type="text"
              placeholder="Email..."
              onChange={setCredentials}
            />
          </div>

          <p className="error">{emailError}</p>
        </div>
        <div>
          <div className="icon-input-container">
            <img className="input-icon" src={lockIcon} alt="lock icon" />
            <input
              name="password"
              value={credentials.password}
              type="password"
              placeholder="Password..."
              onChange={setCredentials}
            />
          </div>

          <p className="error">{passwordError}</p>
        </div>
        <button id="login-button" type="submit" className="form-button">
          Log in
        </button>
      </form>
    </div>
  );
};
