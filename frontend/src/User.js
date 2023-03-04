import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import jwt_decode from "jwt-decode";

import {
    FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
    faUser,
    faBookmark,
    faChalkboard,
    faFileCirclePlus,
    faUsers,
    faClipboardList,
    faChartSimple,
    faFlag,
    faThumbsUp,
    faThumbsDown,
    faComment
} from "@fortawesome/free-solid-svg-icons";
import greddiit from "./Images/greddiit-logo.png"

export const Users = (props) => {
    const { subGreddiitId } = useParams();
    const [subGreddiits, setSubGreddiits] = useState([]);
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

    useEffect(() => {
        const fetchSubGreddiit = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/page/${subGreddiitId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setSubGreddiits(data);
                console.log(data);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSubGreddiit();
    }, [subGreddiitId]);

    const handleRequestOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/requests`;
    };

    const handleReportsOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/reports`;
    };

    const handleUsersOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/users`;
    };

    const handleStatsOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/stats`;
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
                                {username === subGreddiits.createdBy && (
                                    <>
                                        <Nav.Link href="#"><FontAwesomeIcon icon={faUsers} color="black" onClick={() => handleUsersOpen(subGreddiits._id)} /> Users</Nav.Link>
                                        <Nav.Link href="#" onClick={() => handleRequestOpen(subGreddiits._id)}>
                                            <FontAwesomeIcon icon={faClipboardList} color="black" /> Requests
                                        </Nav.Link>
                                        <Nav.Link href="#" onClick={() => handleStatsOpen(subGreddiits._id)}><FontAwesomeIcon icon={faChartSimple} color="black" /> Stats</Nav.Link>
                                        <Nav.Link href="#" onClick={() => handleReportsOpen(subGreddiits._id)}><FontAwesomeIcon icon={faFlag} color="black" /> Reports</Nav.Link>
                                    </>
                                )}
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
                    <h2 className="titleChange">Fetching Users...</h2>
                </div>
            )}
            {
                <div style={{ marginTop: '100px' }}>
                    <div className="hdng">
                        <h3>Unblocked Users: {subGreddiits.name}</h3>
                        {subGreddiits.followers && subGreddiits.followers.length ? (
                            subGreddiits.followers.map((followers) => (
                                <div key={followers._id}>
                                    <p>{followers.firstName}</p>
                                </div>
                            ))
                        ) : (
                            <p>No users yet...</p>
                        )}
                    </div>
                    <div className="hdng">
                        <h3>Blocked Users: {subGreddiits.name}</h3>
                        {subGreddiits.blockedUsers && subGreddiits.blockedUsers.length ? (
                            subGreddiits.blockedUsers.map((blockedUsers) => (
                                <div key={blockedUsers._id}>
                                    <p>{blockedUsers.firstName}</p>
                                </div>
                            ))
                        ) : (
                            <p>No blocked users yet...</p>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default Users;
