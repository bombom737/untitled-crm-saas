//import axios from "axios";
import { useRef } from "react";
import { userExists } from '../services/auth'
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const formInput = useRef<HTMLInputElement>(null);

  //async 
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent screen refresh and loss of data

    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const user = userExists(existingUsers, email, password) // Replace with actual API call: await axios.post("/login", { email, password });
      console.log(user);
      
      if (user) {
        alert("User Identified!")
        localStorage.setItem('currentlyLoggedInUser', JSON.stringify(user))
        navigate("/dashboard");
      } else {
        alert("Login failed, please try again!");
        if (formInput.current) {
          formInput.current.focus();
        }
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
            <input id="email" type="text" ref={formInput} placeholder="Email"/>
            {/* {emailError && <p className="error">Please enter a valid email.</p>} */}
          </div>
      <div className="field">
            <input id="password" type="password" placeholder="Password"/>
            {/* {passwordError && (
              <p className="error">
                Password must be at least 8 characters long, and must contain an
                uppercase and a lowercase character.
              </p>
            )} */}
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
