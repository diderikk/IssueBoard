import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLoginMutation } from "../generated/graphql";
import { useForm } from "../hooks/useForm";

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

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
	const [submitError, setSubmitError] = useState<string>("");
	const [login] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

		if(validateForm()){
			const response = await login({
				variables: {
					email: credentials.email,
					password: credentials.password
				}
			});

 			const errors = response.data?.login?.errors

			if(errors){
				setSubmitError(errors.join(", "))
				return;
			}

			localStorage.setItem("token", response.data?.login?.accessToken!);

			history.push("/");
		}
  };

  const validateForm = ():boolean => {
		let valid = true;

    if (credentials.email.trim().length === 0){
			setEmailError("Email field is empty")
			valid = false;
		}
    else setEmailError("");
    if (credentials.password.trim().length === 0){
      setPasswordError("Password field is empty");
			valid = false;
		}
    else setPasswordError("");

		return valid;
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="email"
            value={credentials.email}
            type="text"
            placeholder="Email..."
            onChange={setCredentials}
          />
          <p className="error">{emailError}</p>
        </div>
        <div>
          <input
            name="password"
            value={credentials.password}
            type="password"
            placeholder="Password..."
            onChange={setCredentials}
          />
          <p className="error">{passwordError}</p>
        </div>
        <button type="submit">Log in</button>
				<p className="error">{submitError}</p>
      </form>
    </div>
  );
};
