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

export const Requests = (props) => {
    const { subGreddiitId } = useParams();
    const [subGreddiits, setSubGreddiits] = useState([]);
    const [requests, setRequests] = useState([]);
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
                const response = await fetch(`http://localhost:8000/api/page/${subGreddiitId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                // console.log(data);
                setSubGreddiits(data);
            }
            catch (error) {
                console.log(error);
            }
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/subgreddiit/requests/${subGreddiitId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                console.log(data)
                setRequests(data);
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
        fetchSubGreddiit();
    }, [subGreddiitId]);

    const handleAccept = async (request) => {
        try {
            const response = await fetch('http://localhost:8000/api/subgreddiit/req/followSubreddit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    subgredditId: subGreddiits._id,
                    username: request.username,
                    userId: request._id
                })
            });

            const data = await response.json();
            window.location.reload();
            if (data.message === 'User added as follower') {
                alert('User added as follower');
            }
            else if (data.message === 'User is already following the subreddit') {
                alert('User is already a follower');
            }
            else {
                alert('Error');
            }
        } catch (error) {
            console.log('Error adding user as follower:', error);
        }
    }

    const handleReject = async (request) => {
        try {
            const response = await fetch('http://localhost:8000/api/subgreddiit/req/rejectFollower', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    subgredditId: subGreddiits._id,
                    userId: request._id
                })
            });

            const data = await response.json();
            window.location.reload();
            if (data.message === 'User rejected') {
                alert('User rejected');
            }
            else {
                alert('Error');
            }
        } catch (error) {
            console.log('Error rejecting:', error);
        }
    }

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
                                        <Nav.Link href="#" onClick={() => handleUsersOpen(subGreddiits._id)}><FontAwesomeIcon icon={faUsers} color="black" /> Users</Nav.Link>
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
                    <h2 className="titleChange">Fetching Requests...</h2>
                </div>
            )}
            {
                <div style={{ marginTop: '100px' }}>
                    <div className="hdng">
                        <h3>Requests: {subGreddiits.name}</h3>
                    </div>
                    {requests.length > 0 ? (
                        requests.map(request => (
                            <div className="Qcontainer" id="quote-content" key={request._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {request.username}
                                <div>
                                    <button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={() => handleAccept(request)}>
                                        Accept
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleReject(request)}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                            <h2 className="titleChange">No requests yet...</h2>
                        </div>
                    )}
                </div>
            }
        </div>
    );
};

export default Requests;
