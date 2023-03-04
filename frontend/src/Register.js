import React, { useState, useEffect } from "react";

export const Register = (props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [num, setNum] = useState('');

    useEffect(() => {
        if (localStorage.getItem("sessionToken") === "loggedOut") {
            window.location.href = `/`;
        }
    }, [localStorage.getItem("sessionToken")]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { firstName, lastName, email, username, password, age, contactNumber: num };

        try {
            const response = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            console.log(data);

            if (data.message === 'User registered successfully') {
                alert('User registered successfully');
                window.location.reload();
            }
            else if (data.message === 'User already exists') {
                alert('User already exists');
            }
            else if(data.message === 'Missing required fields'){
                alert('Missing required fields');
            }
            else if(data.message === 'Invalid input data'){
                alert('Invalid input data');
            }
            else if(data.message === 'User with this email already exists'){
                alert('User with this email already exists');
            }
            // window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign Up</h3>
                    <div className="text-center">
                        Already registered?{" "}
                        <span onClick={() => props.onFormSwitch('Login')} className="link-primary">
                            Sign In
                        </span>
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group mt-3">
                            <label>First Name</label>
                            <input
                                value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                type="firstName"
                                className="form-control mt-1"
                                placeholder="Jane"
                            />
                        </div>
                        <div className="col-md-6 form-group mt-3">
                        <label>Last Name</label>
                        <input
                            value={lastName} onChange={(e) => setLastName(e.target.value)}
                            type="lastName"
                            className="form-control mt-1"
                            placeholder="Doe"
                        />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group mt-3">
                            <label>Email address</label>
                            <input
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="form-control mt-1"
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="col-md-6 form-group mt-3">
                            <label>Username</label>
                            <input
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                type="username"
                                className="form-control mt-1"
                                placeholder="janeDoe2027"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group mt-3">
                            <label>Age</label>
                            <input
                                value={age} onChange={(e) => setAge(e.target.value)}
                                type="age"
                                className="form-control mt-1"
                                placeholder="21"
                            />
                        </div>
                        <div className="col-md-6 form-group mt-3">
                            <label>Contact Number</label>
                            <input
                                value={num} onChange={(e) => setNum(e.target.value)}
                                type="contact"
                                className="form-control mt-1"
                                placeholder="9876543210"
                            />
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="form-control mt-1"
                            placeholder="********"
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register;