/* eslint-disable no-underscore-dangle */
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../../mockAPI/mockAPI';
import './loginComponent.css';

/**
 * Login component
 * @returns Login elements
 */
function LoginComponent() {
  const history = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const changeHandler = () => {
    history('/registration');
  };
  const [message, setMessage] = useState(null);

  // submit to the backend
  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;
    const loginRes = await userLogin(enteredUsername, enteredPassword);
    // console.log('loginRes', loginRes);
    if (loginRes.token === undefined) {
      usernameRef.current.value = '';
      passwordRef.current.value = '';
      // eslint-disable-next-line no-alert
      setMessage(loginRes.data.message);
    } else {
      localStorage.setItem('myUserID', loginRes.data._id);
      usernameRef.current.value = '';
      passwordRef.current.value = '';
      history(`/home/${loginRes.data._id}`);
      window.location.reload();
    }
  };

  return (
    <div>
      <section className="auth">
        <h1>SignIn</h1>
        <form className="submitForm" onSubmit={submitHandler}>
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
          <div className="actions">
            <button
              className="loginButton"
              type="button"
              onClick={submitHandler}
            >
              Sign in
            </button>
            <button
              type="button"
              className="toggle1"
              onClick={changeHandler}
            >
              Create a new account
            </button>
          </div>
          <div className="message">{message}</div>
        </form>
      </section>
    </div>
  );
}
export default LoginComponent;
