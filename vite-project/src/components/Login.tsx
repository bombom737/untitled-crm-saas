import { useRef } from "react";

export function Login() {
  const formInput = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const response = existingUsers.find((user:any) => user.email === email && user.password === password); 
      if (response) {
        alert("User identified!");
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
            <input required id="email" type="text" ref={formInput} placeholder="Email"/>
          </div>
      <div className="field">
            <input required id="password" type="password" placeholder="Password"/>
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
