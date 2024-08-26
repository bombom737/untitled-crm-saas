export function userExists(userArray:Array<string>, email:string, password:string) { // in the future i will post to the database to see if the input user exists in database
    return userArray.find((user:any) => user.email === email && user.password === password)
}

export function redirectUser(navigate: Function) {
    const user = localStorage.getItem('currentlyLoggedInUser');
    if (!user) {
      navigate('/');
      return true; // Redirect to login page if no user is logged in
    }
    return false; // Keep user on the page if logged in
  }