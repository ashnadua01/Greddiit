import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBookmark, faChalkboard, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import greddiit from "./Images/greddiit-logo.png"

export const Dashboard = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        const message = document.createElement('p');
        message.textContent = 'You are not logged in.';
        document.body.appendChild(message);
    }

    const decoded = jwt_decode(token);
    const username = decoded.username;
    const userId = decoded.id;

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
            <div className="wrapper" style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
                <h2 style={{marginTop: '20vh'}} className="titleChange">Welcome to Greddiit, {username}</h2>
            </div>
            <div>
                
            </div>
        </div>
    )
}

export default Dashboard;