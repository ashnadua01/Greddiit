import React, { useState, useEffect } from "react";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import jwt_decode from "jwt-decode";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBookmark, faChalkboard, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import greddiit from "./Images/greddiit-logo.png"

export const MySubGreddiit = (props) => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [bannedKeywords, setBannedKeywords] = useState([]);
    const [subGreddiits, setSubGreddiits] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [image, setImage] = useState(null);

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
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:8000/api/getMySubGreddiit", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setSubGreddiits(data);
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleOpen = () => {
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        setShowForm(false);
        e.preventDefault();
        const token = localStorage.getItem('token');
        const decodedToken = jwt_decode(token);
        const username = decodedToken.username;
        const userId = decodedToken.id;
        const tagsArray = typeof tags === 'string' ? tags.split(/[ ,]+/).map((tag) => tag.trim()) : [];
        const bannedKeywordsArray = typeof bannedKeywords === 'string' ? bannedKeywords.split(/[ ,]+/).map((keyword) => keyword.trim()) : [];


        const subgr = { name, description, tags: tagsArray, bannedKeywords: bannedKeywordsArray, createdBy: username, followers: [userId] };

        try {
            fetch("http://localhost:8000/api/createMySubGreddiit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify(subgr)
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message === 'Data is missing') {
                        alert('Data is missing');
                    }
                    window.location.reload();
                })
                .catch((err) => {
                    console.error(err);
                    alert('An error occurred. Please try again later.');
                });
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again later.');
        }
    };



    const handleDelete = async (subGreddiitId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/deleteMySubGreddiit/' + subGreddiitId, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.message === 'SubGreddiit deleted successfully') {
                alert('SubGreddiit deleted successfully')
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleButtonOpen = async (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}`;
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
                    <h2 className="titleChange">Fetching My Sub Greddiits...</h2>
                </div>
            )}
            {
                <div style={{ paddingTop: "60px" }}>
                    {showForm === false && (<div>
                        <br /><br />
                        <button className="btn btn-primary" style={{ marginLeft: '45%' }} onClick={handleOpen}>
                            Create Subreddit
                        </button>
                        {subGreddiits.length > 0 ? (subGreddiits.map((subgreddiit) => (
                            <div className="Qcontainer" id="quote-content" key={subgreddiit.name}>
                                <div>
                                    <div className="quote-nav">
                                        <h2 id="titleQ">{subgreddiit.name}</h2>
                                        <button className="btn btn-primary" style={{ float: 'right' }} onClick={() => handleDelete(subgreddiit._id)}>Delete</button>
                                        <button className="btn btn-primary" style={{ float: 'right', marginRight: '7px' }} onClick={() => handleButtonOpen(subgreddiit._id)}>Open</button>
                                        <br /><br />
                                    </div>
                                    <div className="quote-container">
                                        <p>Description: {subgreddiit.description}</p>
                                        <p>Banned Keywords: {subgreddiit.bannedKeywords.join(", ")}</p>
                                        <p>Number of Posts: {subgreddiit.postCount}</p>
                                        <p>Followers: {subgreddiit.followers.length}</p>
                                    </div>
                                </div>
                            </div>
                        ))) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                                <h2 className="titleChange">You have not created any Sub Greddiits yet.</h2>
                            </div>
                        )}
                    </div>)}
                    {showForm && (
                        <div className="Auth-form-container">
                            <form className="Auth-form" onSubmit={handleSubmit}>
                                <div className="Auth-form-content">
                                    <h3 className="Auth-form-title">Create SubGreddiit</h3>
                                    <div className="form-group mt-3">
                                        <label>Name</label>
                                        <input
                                            value={name} onChange={(e) => setName(e.target.value)}
                                            type="name"
                                            className="form-control mt-1"
                                            placeholder="e.g Campus"
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>Description</label>
                                        <input
                                            value={description} onChange={(e) => setDescription(e.target.value)}
                                            type="description"
                                            className="form-control mt-1"
                                            placeholder="News about campus"
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>Tags</label>
                                        <input
                                            value={tags} onChange={(e) => setTags(e.target.value)}
                                            type="username"
                                            className="form-control mt-1"
                                            placeholder="e.g. Typhoid, Dogs, Research, etc."
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>Banned Keywords</label>
                                        <input
                                            value={bannedKeywords} onChange={(e) => setBannedKeywords(e.target.value)}
                                            type="bannedKeywords"
                                            className="form-control mt-1"
                                            placeholder="e.g. Shit, Fuck, etc."
                                        />
                                    </div>
                                    <div className="d-grid gap-2 mt-3">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="incWidth">
                                                        <button type="submit" className="btn btn-primary btn-block" style={{ marginRight: '100px' }}>
                                                            Submit
                                                        </button>
                                                    </td>
                                                    <td className="incWidth">
                                                        <button className="btn btn-primary btn-block" style={{ marginLeft: '70px' }} onClick={() => setShowForm(false)}>
                                                            Close
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            }
        </div>
    );
};

export default MySubGreddiit;