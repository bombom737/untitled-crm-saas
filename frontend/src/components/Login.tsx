import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../services/axios-api";

export function Login() {
  
  const [loginError, setLoginError] = useState(false)

  const navigate = useNavigate();
  
  const formInput = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent screen refresh and loss of data

    setLoginError(false)
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    apiPost('/login', {
      email: email,
      password: password
    })
    .then((response) => {
      if (response.status === 201){
        alert("User Identified!");
        navigate("/dashboard");
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 403) {
        setLoginError(true)
        console.error('Error during registration:', error);
        if (formInput.current) {
          formInput.current.focus();
        }
      } else{
        console.log("Validation failed");

      }
    });
  }
  

  return (
    <form onSubmit={submit}>
      <div className="field">
            <input id="email" type="text" ref={formInput} placeholder="Email"/>
            {loginError && <p className="error">Email or password are incorrect.</p>}
          </div>
      <div className="field">
            <input id="password" type="password" placeholder="Password"/>
            <p>Forgot password?</p>
          </div>
      <div className="field btn">
          <div className="btn-layer">
            <button type="submit">Login</button>
          </div>
        </div>
    </form>
  );
}

export default Login;
