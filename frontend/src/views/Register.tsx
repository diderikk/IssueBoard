import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useCreateUserMutation } from "../generated/graphql";
import { useForm } from "../hooks/useForm";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../util/registerValidation";

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

  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordErrror] = useState<string>("");
	const [submitError, setSubmitError] = useState<string>("");
  const history = useHistory();
	const [register] = useCreateUserMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAll()) return;
		
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
			setSubmitError(errors.join(", "))
			return;
		}

		

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
				<p className="error">{submitError}</p>
      </form>
    </div>
  );
};
