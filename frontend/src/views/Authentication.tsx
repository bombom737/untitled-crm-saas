import { useState, useEffect } from "react";
import { Login } from "../components/Login";
import { SignUp } from "../components/SignUp";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../services/helpers";
import './Authentication.css';

export function Authentication() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state to avoid rendering whole site if user is to be redirected

  useEffect(() => {
    // Check if there is a user currently logged-in in cookeis
    if (getCookie('userFirstName')) {
      // If a user is found, redirect to the dashboard
      navigate('/dashboard');
    } else {
      // If no user is found, allow the login/signup forms to render
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLoginClick = () => setIsLogin(true);
  const handleSignupClick = () => setIsLogin(false);

  function handleSignUpSuccess() {
    setIsLogin(true); // Switch to the login view
  }

  // Show a loading state or nothing until the check is complete
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrapper">
      <div className="form-container">
        <div className="slide-controls">
          <input type="radio" name="slide" id="login" checked={isLogin} readOnly />
          <input type="radio" name="slide" id="signup" checked={!isLogin} readOnly />
          <label className="slide login" onClick={handleLoginClick}>
            Login
          </label>
          <label className="slide signup" onClick={handleSignupClick}>
            Signup
          </label>
          <div className="slider-tab"></div>
        </div>
        <div className="form-inner">
          {isLogin ? <Login /> : <SignUp onSignUpSuccess={handleSignUpSuccess} />}
        </div>
      </div>
    </div>
  );
}

export default Authentication;
