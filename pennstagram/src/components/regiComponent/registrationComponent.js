import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userRegistration } from '../../mockAPI/mockAPI';
import './registrationComponent.css';

/**
 * Registration component
 * @returns Registration elements
 */
function RegistrationComponent() {
  const [message, setMessage] = useState(null);
  const history = useNavigate();
  const nameRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const changeHandler = () => {
    history('/');
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    // get the input values of name, username, password and confirmPassword
    const enteredName = nameRef.current.value;
    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;
    const enteredConfirmPassword = confirmPasswordRef.current.value;
    await userRegistration(enteredName, enteredUsername, enteredPassword, enteredConfirmPassword)
      .then((res) => {
        // console.log('res', res);
        if (res.status === 404) {
          nameRef.current.value = '';
          usernameRef.current.value = '';
          passwordRef.current.value = '';
          confirmPasswordRef.current.value = '';
          setMessage(res.data.message);
        } else {
          nameRef.current.value = '';
          usernameRef.current.value = '';
          passwordRef.current.value = '';
          confirmPasswordRef.current.value = '';
          history('/');
        }
      });
  };
  return (
    <div>
      <section className="auth">
        <h1>SignUp</h1>
        <form onSubmit={submitHandler}>
          <div className="control">
            <label htmlFor="name">
              Your Full Name
              <input type="text" id="name" required ref={nameRef} />
            </label>
          </div>
          <div className="control">
            <label htmlFor="username">
              Your Username
              <input type="text" id="username" required ref={usernameRef} />
            </label>
          </div>
          <div className="control">
            <label htmlFor="password">
              Your Password
              <input type="password" id="password" required ref={passwordRef} />
            </label>
          </div>
          <div className="control">
            <label htmlFor="confirmPassword">
              Confirm Password
              <input type="password" id="confirmPassword" required ref={confirmPasswordRef} />
            </label>
          </div>
          <div className="actions">
            <button
              className="regiButton"
              type="button"
              onClick={submitHandler}
            >
              Register
            </button>
            <button
              type="button"
              className="toggle"
              onClick={changeHandler}
            >
              Change to login
            </button>
          </div>
          <div className="regimessage">{message}</div>
        </form>
      </section>
    </div>
  );
}

export default RegistrationComponent;
