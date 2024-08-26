import { useState } from "react";
import { Login } from "../components/Login";
import { SignUp } from "../components/SignUp";

export function Authentication() {
  const [isLogin, setIsLogin] = useState(true);

      function handleSignUpSuccess() {
        setIsLogin(true); //Switch to the login view
      }
    
      return (
        <div>
          <label onClick={() => setIsLogin(true)}>
          <input type="button" id="login" onClick={() => setIsLogin(true)}  />
            Login
          </label>
          <label onClick={() => setIsLogin(false)}>
          <input type="button" id="signup" onClick={() => setIsLogin(false)}  />
            Signup
          </label>
          {isLogin ? <Login /> : <SignUp onSignUpSuccess={handleSignUpSuccess} />}
        </div>
      );
    }