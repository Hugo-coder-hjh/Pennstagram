import React from 'react';
import LoginComponent from '../../components/loginComponent/loginComponent';
import './login.css';

function Login() {
  return (
    <div className="login">
      <LoginComponent />
      <div className="testidANDpassword">
        <h5>testUsername: guest</h5>
        <h5>testPassword: 123456</h5>
      </div>
    </div>
  );
}

export default Login;
