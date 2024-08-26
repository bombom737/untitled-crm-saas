import { useRef, useState } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function SignUp({ onSignUpSuccess }: { onSignUpSuccess: () => void }) {
  //State to manage the display of errors that occur when user signs up
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    passConfirm: false,
  });

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passConfirmRef = useRef<HTMLInputElement>(null);

  // Utility funcion that takes a value and a validation function and returns result  
  const validateInput = (value: string, validationFn: (value: string) => boolean) => {
    return validationFn(value);
  };

  const conditions = {
    firstName: (value: string) => value !== "",
    lastName: (value: string) => value !== "",
    email: (value: string) => value.includes("@") && value.includes(".com"),
    password: (value: string) =>
      value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value),
    passConfirm: (value: string) =>
      passwordRef.current?.value === value,
  };

  // Perform all validations and return a boolean if all fields are valid
  const handleValidation = () => {
    debugger
    const newErrors = {
      firstName: !validateInput(firstNameRef.current?.value || "", conditions.firstName),
      lastName: !validateInput(lastNameRef.current?.value || "", conditions.lastName),
      email: !validateInput(emailRef.current?.value || "", conditions.email),
      password: !validateInput(passwordRef.current?.value || "", conditions.password),
      passConfirm: errors.passConfirm 
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handlePasswordChange = () => {
    // Get the password and check the condition
    const isPasswordValid = validateInput(passwordRef.current?.value || "", conditions.password)
        // Update the errors state, keeping all errors as they are except password
        setErrors(prevErrors => ({
          ...prevErrors,
          password: !isPasswordValid // If valid, set to false (no error), else set to true (error exists)
        }));

  }
  
  const handlePassConfirmChange = () => {

    const isPassConfirmValid = validateInput(passConfirmRef.current?.value || "", conditions.passConfirm);
  
    setErrors(prevErrors => ({
      ...prevErrors,
      passConfirm: !isPassConfirmValid
    }));
  };

  function saveUserToLocalStorage(user: User) {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]") as User[];

    if (!existingUsers.some(existingUser => existingUser.email === user.email)) {
      existingUsers.push(user);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      return true;
    }
    return false;
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (handleValidation()) {
      const newUser: User = {
        firstName: firstNameRef.current?.value || "",
        lastName: lastNameRef.current?.value || "",
        email: emailRef.current?.value || "",
        password: passwordRef.current?.value || "", // Should hash the password in DB
      };

      if (saveUserToLocalStorage(newUser)) {
        onSignUpSuccess();
      } else {
        alert("Already a user, log in!");
      }
    }}


  return (
    <form className="signup">
      <div className="input">
        <div className="row">
          <div className="field first-name-div">
            <input id="first-name" type="text" ref={firstNameRef} placeholder="First Name" />
            {errors.firstName && <p className="error">Please enter a first name.</p>}
          </div>
          <div className="field">
            <input id="last-name" type="text" ref={lastNameRef} placeholder="Last Name" />
            {errors.lastName && <p className="error">Please enter a last name.</p>}
          </div>
        </div>
        <div className="field">
          <input id="email" type="text" ref={emailRef} placeholder="Email" />
          {errors.email && <p className="error">Please enter a valid email.</p>}
        </div>
        <div className="field">
          <input id="password" type="password" ref={passwordRef} placeholder="Password" onChange={() => {handlePasswordChange(); handlePassConfirmChange();}}/>
          {errors.password && (
            <p className="error">
              Password must be at least 8 characters long, and must contain an
              uppercase and a lowercase character.
            </p>
          )}
        </div>
        <div className="field passconfirm">
          <input id="confirm-password" type="password" ref={passConfirmRef} placeholder="Confirm Password" onChange={handlePassConfirmChange}/>
          {errors.passConfirm && <p className="error">Passwords do not match.</p>}
        </div>
      </div>
      <div className="field btn">
        <div className="btn-layer">
          <button type="submit" onClick={submit}>Sign Up</button>
        </div>
      </div>
    </form>
  );
}
