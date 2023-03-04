import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export const Login = (props) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token === "loggedIn") {
      navigate("/Dashboard");
    }
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call your API endpoint to log the user in
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      const data = await response.json();

      // Check the response from the API and handle it accordingly
      if (data.message === 'Logged in successfully') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('sessionToken', 'loggedIn');
        window.location.href = '/Dashboard';
      } 
      else if(data.message === 'Invalid username or password'){
        alert('Your username or password is incorrect')
      }
      else if(data.message === 'Invalid User'){
        alert('Cannot find user!')
      }
      else if(data.message === 'Missing required fields'){
        alert('Missing required fields');
      }
      else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span onClick={() => props.onFormSwitch('Register')} className="link-primary">
                Sign Up
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                value={username} onChange={(e) => setUsername(e.target.value)}
                type="username"
                className="form-control mt-1"
                placeholder="Enter username"
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                value={password} onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              {errorMessage && <div className="error"> {errorMessage} </div>}
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login;