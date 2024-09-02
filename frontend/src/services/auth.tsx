import { isLoggedIn } from "./axios-api";

export async function redirectUser(navigate: Function) {
  let loggedInStatus:boolean = await isLoggedIn()  
  if (!loggedInStatus) {
      navigate('/');
      return true; // Redirect to login page if no user is logged in
    }
    return false; // Keep user on the page if logged in
  }