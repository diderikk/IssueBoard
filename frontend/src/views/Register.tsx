import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useCreateUserMutation } from "../generated/graphql";
import { useForm } from "../util/useForm";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../util/registerValidation";
import { useSnackBar } from "../util/SnackBarContext";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export const Register: React.FC = () => {
  const [inputValues, setInputValues] = useForm<RegisterForm>({
    username: "",
    email: "",
    password: "",
  });
  const {dispatch} = useSnackBar();

  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordErrror] = useState<string>("");
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
					password: inputValues.password
				}
			}
		})

		const errors = response.data?.createUser?.errors;
		console.log(response.data?.createUser)

		if(errors){
      dispatch({type: 'error', error: errors.join(", ")})
			return;
		}

		
    dispatch({type: 'successful'});
    history.push("/");
  };

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
    <div>
      <h1>Register user</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            name="username"
            value={inputValues.username}
            type="text"
            placeholder="Username..."
            onChange={setInputValues}
            onBlur={() =>
              validateUsername(inputValues.username, setUsernameError)
            }
          />
          <p className="error">{usernameError}</p>
        </div>
        <div>
          <label>Email:</label>
          <input
            name="email"
            value={inputValues.email}
            type="text"
            placeholder="Email..."
            onChange={setInputValues}
            onBlur={() => validateEmail(inputValues.email, setEmailError)}
          />
          <p className="error">{emailError}</p>
        </div>
        <div>
          <label>Password:</label>
          <input
            name="password"
            value={inputValues.password}
            type="password"
            placeholder="Password..."
            onChange={setInputValues}
            onBlur={() =>
              validatePassword(inputValues.password, setPasswordErrror)
            }
          />
          <p className="error">{passwordError}</p>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
