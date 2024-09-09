import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDarkExample from "../components/Navbar";
import { redirectUser } from '../services/auth';
import './Base.css';
import { getCookie } from '../services/helpers';

interface BaseProps {
  viewComponent: ReactNode;
}

export default function Base({ viewComponent }: BaseProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkRedirect() {
      const shouldRedirect = await redirectUser(navigate);
      if (shouldRedirect === false) {
        setIsLoading(false);
      }
    }
  
    checkRedirect();
  }, [navigate]);
  

  function getFirstName() {
    let firstName = getCookie('userFirstName');
    if(firstName !== null){
      return firstName
    }
     return `UNSIGNED USER If you're seeing this text something is broken :)`;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="navbar-container">
        <NavbarDarkExample username={getFirstName()} />
      </div>
      <div className="container">
        <div className='white-background'>
          {viewComponent}
        </div>
      </div>
    </>
  );
}
