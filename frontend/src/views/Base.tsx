import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDarkExample from "../components/Navbar";
import { redirectUser } from '../services/auth';
import './Base.css';

interface BaseProps {
  viewComponent: ReactNode;
}

export default function Base({ viewComponent }: BaseProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    
    if (loggedInStatus === 'true') {
      setIsLoading(false);
    } else {
      if (!redirectUser(navigate)) {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoading(false);
      }
    }
  }, [navigate]);

  function getUser() {
    let user = JSON.parse(localStorage.getItem('currentlyLoggedInUser') || '{}');
    return user.firstName || `UNSIGNED USER If you're seeing this text something is broken :)`;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="navbar-container">
        <NavbarDarkExample username={getUser()} />
      </div>
      <div className="container">
        <div className='white-background'>
          {viewComponent}
        </div>
      </div>
    </>
  );
}
