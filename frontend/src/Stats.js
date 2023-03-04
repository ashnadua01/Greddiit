import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import jwt_decode from "jwt-decode";

import { Line } from 'react-chartjs-2';

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

export const Stats = (props) => {
    const { subGreddiitId } = useParams();
    const [subGreddiits, setSubGreddiits] = useState([]);
    const [posts, setPosts] = useState([]);
    const [counts, setCounts] = useState([]);
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
                setSubGreddiits(data);
            }
            catch (error) {
                console.log(error);
            }
        };
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/posts/${subGreddiitId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                console.log(data);
                setPosts(data);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchSubGreddiit();
        fetchPosts();
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

    useEffect(() => {
        const aggregatePostCountByDay = async (posts) => {
            const countByDay = {};

            posts.forEach((post) => {
                const createdAt = new Date(post.createdAt);
                const year = createdAt.getFullYear();
                const month = createdAt.getMonth() + 1;
                const day = createdAt.getDate();
                const dateKey = `${year}-${month}-${day}`;

                if (countByDay[dateKey]) {
                    countByDay[dateKey]++;
                } else {
                    countByDay[dateKey] = 1;
                }
            });

            const counts = Object.entries(countByDay).map(([date, count]) => {
                return { date: new Date(date), count };
            });

            return counts;
        }

        const getCounts = async () => {
            const counts = await aggregatePostCountByDay(posts);
            console.log(counts);
            setCounts(counts);
        };

        getCounts();
    }, [posts]);


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
            <div>
                <br /><br /><br /><br /><br />
                <h2 className="titleChange" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Growth of Followers</h2>
                <br />
                {subGreddiits.followerHistory && subGreddiits.followerHistory.length > 0 ? (
                    <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Followers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subGreddiits.followerHistory.map(history => (
                                <tr key={history.id}>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(history.timestamp).toLocaleDateString()}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{history.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                        <h2 className="titleChange">No stats yet...</h2>
                    </div>
                )}
            </div>
            <div>
                <br /><br /><br /><br /><br />
                <h2 className="titleChange" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Daily Posts</h2>
                <br />
                {counts && counts.length > 0 ? (
                    <table style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
                                <th style={{ border: '1px solid black', padding: '8px' }}>Daily Posts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {counts.map(count => (
                                <tr key={count.date}>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{count.date.toLocaleDateString()}</td>
                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{count.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                        <h2 className="titleChange">No stats yet...</h2>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Stats;
