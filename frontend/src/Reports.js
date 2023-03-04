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

export const Reports = (props) => {
    const { subGreddiitId } = useParams();
    const [subGreddiits, setSubGreddiits] = useState([]);
    const [reports, setReports] = useState([]);
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

    const handleDeleteOldReports = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/reports/${subGreddiitId}/oldReports`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            if (data.deletedReports && data.deletedReports.length) {
                setReports(prevReports => prevReports.filter(report => data.deletedReports.includes(report._id)));
            }
        } catch (error) {
            console.log(error);
        }
    };



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
        const fetchAllReports = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/reports/${subGreddiitId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setReports(data);
                console.log(data);
                await handleDeleteOldReports();
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchAllReports();
        fetchSubGreddiit();
    }, []);

    const handleRequestOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/requests`;
    };

    const handleReportsOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/reports`;
    };

    const handleUsersOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/users`;
    };

    const handleIgnore = async (report) => {
        if (report.ignored === true) {
            alert('You have already ignored this report');
        } else {
            try {
                const reportId = report._id;
                const response = await fetch(
                    `http://localhost:8000/api/reports/${reportId}/ignore`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.message === 'Report ignored') {
                    alert('Report ignored');
                    setReports((prevReports) =>
                        prevReports.map((prevReport) =>
                            prevReport._id === reportId ? { ...prevReport, ignored: true } : prevReport
                        )
                    );
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleBlockFlag = async (report) => {
        if (report.blocked === true) {
            alert('User is blocked already');
        } else {
            try {
                const reportId = report._id;
                const response = await fetch(
                    `http://localhost:8000/api/reports/${reportId}/block`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                if (data.message === 'User was blocked') {
                    setReports((prevReports) =>
                        prevReports.map((prevReport) =>
                            prevReport._id === reportId ? { ...prevReport, blocked: true } : prevReport
                        )
                    );
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleBlock = async (report) => {
        try {
            const postId = report.post._id;
            const response = await fetch(`http://localhost:8000/api/reports/${subGreddiitId}/${postId}/block-user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ report })
            });
            const data = await response.json();
            if (data.message === 'User blocked') {
                handleBlockFlag(report);
                alert('User blocked');
            }
            if (data.message === 'User already blocked') {
                alert('User already blocked');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (report) => {
        try {
            const postId = report.post._id;
            const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ report })
            });
            const data = await response.json();
            console.log(data);
            window.location.reload()
        } catch (error) {
            console.error(error);
            alert('Error');
        }
    }

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
                    <h2 className="titleChange">Fetching Reports...</h2>
                </div>
            )}
            {
                <div style={{ marginTop: '100px' }}>
                    <div className="hdng">
                        <h3>Reports: {subGreddiits.name}</h3>
                    </div>
                    {reports.length > 0 ? (reports.map(report => (
                        <div className="Qcontainer" id="quote-content" key={report._id}>
                            <div className="quote-nav" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p><strong>Reported By:</strong> {report.reportedBy.firstName} {report.reportedBy.lastName}</p>
                                <p><strong>Reported User:</strong> {report.reportedUser.firstName} {report.reportedUser.lastName}</p>
                            </div>
                            <div className="quote-container">
                                <p><strong>Concern: </strong>{report.concern}</p>
                                <p><strong>Post Content: </strong>{report.postContent}</p>
                            </div>
                            <div className="buttonsContainer">
                                {!report.ignored && (
                                    <div className="button-group">
                                        <button className="btn btn-primary" onClick={() => handleBlock(report)}>
                                            Block User
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(report)}>
                                            Delete Post
                                        </button>
                                    </div>
                                )}
                                {report.ignored && (
                                    <div className="button-group ignored">
                                        <button className="btn btn-primary" style={{ cursor: 'not-allowed', opacity: '0.5' }}> Block User
                                            <i className="fas fa-ban"></i>
                                        </button>
                                        <button className="btn btn-danger" style={{ cursor: 'not-allowed', opacity: '0.5' }}> Delete Post
                                            <i className="fas fa-ban"></i>
                                        </button>
                                    </div>
                                )}
                                <button className="btn btn-secondary" onClick={() => handleIgnore(report)}>
                                    Ignore
                                </button>
                            </div>

                        </div>
                    ))) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                            <h2 className="titleChange">No reports yet...</h2>
                        </div>
                    )}
                </div>
            }


        </div>
    );
};

export default Reports;
