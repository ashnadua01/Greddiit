import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Modal, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBookmark, faChalkboard, faFileCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import greddiit from "./Images/greddiit-logo.png"

import profileImage from "./Images/img1.jpeg"

export const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [editing, setEditing] = useState(false);
    const [originalUser, setOriginalUser] = useState({});
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [bio, setBio] = useState("");
    const [showFollowModal, setShowFollowModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    if (!token) {
        const message = document.createElement('p');
        message.textContent = 'You are not logged in.';
        document.body.appendChild(message);
    }

    const decoded = jwt_decode(token);
    const username = decoded.username;
    const userId = decoded.id;

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.setItem("sessionToken", "loggedOut");
        // navigate("/");
        window.location.href = `/`;
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/user/${userId}/details`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setUser(data);
                console.log(data);
            } catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleEdit = () => {
        setOriginalUser(user);
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const updatedUser = {};

        if (firstName !== originalUser.firstName && firstName !== '') {
            updatedUser.firstName = firstName;
        }

        if (lastName !== originalUser.lastName && lastName !== '') {
            updatedUser.lastName = lastName;
        }

        if (email !== originalUser.email && email !== '') {
            updatedUser.email = email;
        }

        if (age !== originalUser.age && age !== '') {
            updatedUser.age = age;
        }

        if (contactNumber !== originalUser.contactNumber && contactNumber !== '') {
            updatedUser.contactNumber = contactNumber;
        }

        if (bio !== originalUser.bio && bio !== '') {
            updatedUser.bio = bio;
        }

        const hasUpdates = Object.keys(updatedUser).length;

        if (hasUpdates) {
            try {
                const response = await fetch(`http://localhost:8000/api/user/${userId}/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedUser),
                });

                const data = await response.json();

                if (data.message === 'Email already exists') {
                    alert('This email already exists');
                    setUser(data.user);
                }
                else if (data.message === 'Username already exists') {
                    alert('This username already exists');
                    setUser(data.user);
                }
                else if (data.message === 'User Details updated') {
                    alert('Details updated successfully');
                    setUser(data.send);
                }
                else {
                    alert('Error');
                }
                setEditing(false);
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        } else {
            alert('You have not entered anything');
            setEditing(false);
        }
    };

    const handleCloseFollowModal = async () => {
        setShowFollowModal(false);
    };

    const handleCloseFollowingModal = async () => {
        setShowFollowingModal(false);
    };

    const removeFollower = async (follower) => {
        try {

            const followerId = follower._id
            const response = await fetch(`http://localhost:8000/api/user/${userId}/followers/${followerId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.message === 'User removed successfully') {
                alert(`${follower.username} has been removed from ${username}'s followers`)
            }
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    const removeFollowing = async (following) => {
        try {

            const followingId = following._id
            const response = await fetch(`http://localhost:8000/api/user/${userId}/following/${followingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.message === 'User removed successfully') {
                alert(`${following.username} has been removed from ${username}'s following`)
            }
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="NBar">
                <Navbar style={{ backgroundColor: "#ffffffaa", position: "fixed", top: 0, zIndex: 1, width: "100%" }}>
                    <Container>
                        <Navbar.Brand href="/Profile">
                            <img className="myLogo" src={greddiit} alt="" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                <Nav.Link href="/AllSubGreddiit"><FontAwesomeIcon icon={faChalkboard} color="black" /> Sub Greddiits</Nav.Link>
                                <Nav.Link href="/MySubGreddiit"><FontAwesomeIcon icon={faFileCirclePlus} color="black" /> My Sub Greddiits</Nav.Link>
                                <Nav.Link href="/Saved"><FontAwesomeIcon icon={faBookmark} color="black" /> Saved</Nav.Link>
                                <Nav.Link href="/Profile"><FontAwesomeIcon icon={faUser} color="black" /> Profile</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <h2 className="titleChange">Fetching Profile.</h2>
                </div>
            )}
            {
                <div>
                    <div>
                        <Modal show={showFollowModal} onHide={handleCloseFollowModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Followers</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {user.followers && user.followers.length ? (
                                    user.followers.map((follower) => (
                                        <div key={follower._id} className="follower">
                                            <p>{follower.firstName}</p>
                                            <button className="btn btn-primary" onClick={() => removeFollower(follower)}>Unfollow</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No followers yet.</p>
                                )}
                            </Modal.Body>
                        </Modal>
                    </div>
                    <div>
                        <Modal show={showFollowingModal} onHide={handleCloseFollowingModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Following</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {user.following && user.following.length ? (
                                    user.following.map((following) => (
                                        <div key={following._id} className="follower">
                                            <p>{following.firstName}</p>
                                            <button className="btn btn-primary" onClick={() => removeFollowing(following)}>Unfollow</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>You don't follow anybody yet.</p>
                                )}
                            </Modal.Body>
                        </Modal>
                    </div>
                    <div>
                        {editing ? (
                            <div className="Auth-form-container">
                                <form className="Auth-form" onSubmit={handleSave}>
                                    <div className="Auth-form-content">
                                        <h3 className="Auth-form-title">Edit Profile</h3>
                                        <div className="row">
                                            <div className="col-md-6 form-group mt-3">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                            </div>
                                            <div className="col-md-6 form-group mt-3">
                                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                                <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 form-group mt-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </div>
                                            <div className="col-md-6 form-group mt-3">
                                                <label htmlFor="age" className="form-label">Age</label>
                                                <input type="number" className="form-control" id="age" value={age} onChange={(e) => setAge(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                                            <input type="tel" className="form-control" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label htmlFor="bio" className="form-label">Bio</label>
                                            <textarea className="form-control" id="bio" rows="3" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                                        </div>
                                        <div className="d-flex justify-content-end mt-3">
                                            <button type="submit" className="btn btn-primary me-2">Save</button>
                                            <button type="submit" className="btn btn-danger ms-auto" onClick={handleCancel}>Cancel</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <div className="wrapper">
                                        <div className="profile-card js-profile-card">
                                            <div className="profile-card__img">
                                                <img src={profileImage} alt="" />
                                            </div>

                                            <div className="profile-card__cnt js-profile-cnt">
                                                <div className="profile-card__name"><p>{user.firstName} {user.lastName}</p> </div>
                                                <div className="profile-card__txt">{user.bio}</div>

                                                <div className="profile-card-inf">
                                                    <div className="profile-card-inf__item" onClick={() => setShowFollowModal(true)}>
                                                        <div className="profile-card-inf__title">{Array.isArray(user.followers) ? user.followers.length : 0}</div>
                                                        <div className="profile-card-inf__txt">Followers</div>
                                                    </div>
                                                    <div className="profile-card-inf__item" onClick={() => setShowFollowingModal(true)}>
                                                        <div className="profile-card-inf__title">{Array.isArray(user.following) ? user.following.length : 0}</div>
                                                        <div className="profile-card-inf__txt">Following</div>
                                                    </div>
                                                </div>

                                                <div className="profile-card-ctr">
                                                    <button className="profile-card__button button--orange" onClick={handleEdit}>Edit Profile</button>
                                                    <button className="profile-card__button button--blue" onClick={handleLogout}>Logout</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            }

        </div>
    )
}

export default Profile;