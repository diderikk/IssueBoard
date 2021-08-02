import React, { useContext, useState } from "react";
import "./Register.css";
import { useHistory } from "react-router-dom";
import { useCreateUserMutation } from "../graphql/generated/graphql";
import { useForm } from "../util/useForm";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../util/registerValidation";
import { useSnackBar } from "../context/SnackBarContext";
import { UserContext } from "../context/UserContext";
import { writeToken } from "../util/readAndWriteToken";
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register: React.FC = () => {
  const [inputValues, setInputValues] = useForm<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { dispatch } = useSnackBar();

  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordErrror] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const {setUser, user} = useContext(UserContext);
  const client = useApolloClient();
  const history = useHistory();
  const [register] = useCreateUserMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAll()) return;

    dispatch({ type: "loading" });
    const response = await register({
      variables: {
        attributes: {
          email: inputValues.email,
          name: inputValues.username,
          password: inputValues.password,
        },
      },
    });

    const errors = response.data?.createUser?.errors;

    if (errors) {
      dispatch({ type: "error", error: "Your email is already taken" });
      return;
    }

    dispatch({ type: "successful" });

    writeToken(client, response.data?.createUser?.accessToken!);

    setUser!(response.data?.createUser?.user!)
  };

  useEffect(() => {
    if(user) history.push("/");
  },[user, history]);

  const validateAll = () => {
    let valid = true;

    if (!validateUsername(inputValues.username, setUsernameError))
      valid = false;
    if (!validateEmail(inputValues.email, setEmailError)) valid = false;
    if (!validatePassword(inputValues.password, setPasswordErrror))
      valid = false;

    return valid;
  };

  return (
    <div id="register-container" className="container">
      <h1>Register your account</h1>
      <form id="register-form" onSubmit={handleSubmit}>
        <h3>Username</h3>
        <input
          name="username"
          required
          className="form-input"
          value={inputValues.username}
          type="text"
          placeholder="Username..."
          onChange={setInputValues}
          onBlur={() =>
            validateUsername(inputValues.username, setUsernameError)
          }
        />
        <p className="error">{usernameError}</p>
        <h3>Email</h3>
        <input
          name="email"
          required
          className="form-input"
          value={inputValues.email}
          type="text"
          placeholder="Email..."
          onChange={setInputValues}
          onBlur={() => validateEmail(inputValues.email, setEmailError)}
        />
        <p className="error">{emailError}</p>
        <h3>Password</h3>
        <input
          name="password"
          required
          className="form-input"
          value={inputValues.password}
          type="password"
          placeholder="Password..."
          onChange={setInputValues}
          onBlur={() =>
            validatePassword(inputValues.password, setPasswordErrror)
          }
        />
        <p className="error">{passwordError}</p>
        <h3>Confirm password</h3>
        <input
          name="confirmPassword"
          required
          className="form-input"
          value={inputValues.confirmPassword}
          type="password"
          placeholder="Confirm password..."
          onChange={setInputValues}
          onBlur={() =>
            validateConfirmPassword(
              inputValues.password,
              inputValues.confirmPassword,
              setConfirmPasswordError
            )
          }
        />
        <p className="error">{confirmPasswordError}</p>
        <div className="container">
          <button id="register-button" className="form-button" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
