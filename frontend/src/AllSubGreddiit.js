import React, { useState, useEffect } from "react";
import Fuse from 'fuse.js';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import jwt_decode from "jwt-decode";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBookmark, faChalkboard, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import greddiit from "./Images/greddiit-logo.png"

export const AllSubGreddiit = (props) => {
    const [allSubGreddiits, setSubgreddiits] = useState([]);
    const [filteredSubGreddiits, setFilteredSubgreddiits] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
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
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/getAllSubgreddiits`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setSubgreddiits(data);
                setFilteredSubgreddiits(data);
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const options = {
        includeScore: true,
        keys: ['name'],
        minMatchCharLength: 2,
        threshold: 0.4
    };

    const handleSearch = (event) => {
        const searchQuery = event.target.value;
        const fuse = new Fuse(allSubGreddiits, options);
        const filteredSubreddits = fuse.search(searchQuery);
        setFilteredSubgreddiits(filteredSubreddits.map(result => result.item));
        setSearchQuery(searchQuery);
    };


    const joinSubGreddiit = async (subGreddiitId) => {
        if (!subGreddiitId) {
            console.error('subGreddiitId is undefined');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/api/subgreddiit/join/${subGreddiitId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: userId, username: username, subgredditId: subGreddiitId })
            });
            const data = await response.json();
            if (data.message === 'Request already sent') {
                alert('Request already sent');
            }
            else if (data.message === 'User cannot join again') {
                alert('Sorry! You cannot join again!');
            }
            else if (data.message === 'Request sent') {
                alert('Request sent successfuly');
            }
            else if (data.message === 'User is blocked and cannot send a request') {
                alert('User is blocked and cannot send a request');
            }
            else {
                alert('Error in sending request');
            }
        } catch (error) {
            console.error(error);
        }

    };

    const isSubgreddiitCreator = (creator) => {
        return creator === username;
    }

    const handleLeave = async (subgreddiitId) => {
        try {
            const response = await fetch('http://localhost:8000/api/subgreddiit/req/removeFollower', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    subgredditId: subgreddiitId,
                    username: username,
                    userId: userId
                })
            });

            const data = await response.json();
            window.location.reload();
            if (data.message === 'Subgreddit left successfully') {
                alert('Subgreddit left successfully');
            }
            else {
                alert('Error');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    const handleButtonOpen = async (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}`;
    };

    const handleSortChange = (eventKey) => {
        let sortingFunctions = [];

        switch (eventKey) {
            case 'name-asc':
                sortingFunctions.push((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortingFunctions.push((a, b) => b.name.localeCompare(a.name));
                break;
            case 'followers':
                sortingFunctions.push((a, b) => {
                    const aFollowers = a.followers ? a.followers.length : 0;
                    const bFollowers = b.followers ? b.followers.length : 0;
                    return bFollowers - aFollowers;
                });
                break;
            case 'creation-date':
                sortingFunctions.push((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
                break;
            default:
                break;
        }

        const sortedSubGreddiits = allSubGreddiits.sort((a, b) => {
            for (let sortFunc of sortingFunctions) {
                const result = sortFunc(a, b);
                if (result !== 0) {
                    return result;
                }
            }
            return 0;
        });
        setSubgreddiits([...sortedSubGreddiits]);
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
                    <h2 className="titleChange">Fetching Sub Greddiits...</h2>
                </div>
            )}
            {
                <div>
                    <br /><br /><br />
                    <div className="Qcontainer" id="quote-content" style={{ width: "70%" }}>
                        <div className="quote-nav">
                            <h2>Search Form</h2>
                        </div>
                        <br />
                        <input type="text" placeholder="Search" onChange={handleSearch} value={searchQuery} />
                        <Dropdown onSelect={handleSortChange}>
                            <Dropdown.Toggle variant="primary" id="sort-dropdown" style={{ float: 'right', marginTop: '-37px' }}>
                                Sort
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="name-asc">Sort by Name - Ascending</Dropdown.Item>
                                <Dropdown.Item eventKey="name-desc">Sort by Name - Descending</Dropdown.Item>
                                <Dropdown.Item eventKey="followers">Sort by Followers</Dropdown.Item>
                                <Dropdown.Item eventKey="creation-date">Sort by Creation Date</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </div>

                    <div>
                        {searchQuery ? (
                            <div>
                                {filteredSubGreddiits.length > 0 ? (filteredSubGreddiits.map(subgreddiit => (
                                    <div className="Qcontainer" id="quote-content" key={subgreddiit.name}>
                                        <div>
                                            <div className="quote-nav">
                                                <h2 id="titleQ">{subgreddiit.name}</h2>
                                                {subgreddiit.followers.includes(userId) ? (
                                                    <>
                                                        {!isSubgreddiitCreator(subgreddiit.createdBy) && (
                                                            <button className="btn btn-primary" style={{ float: 'right' }} onClick={() => handleLeave(subgreddiit._id)}>
                                                                Leave
                                                            </button>
                                                        )}
                                                        {isSubgreddiitCreator(subgreddiit.createdBy) && (
                                                            <button className="btn btn-primary" style={{ float: 'right', cursor: 'not-allowed' }}> Leave
                                                                <i className="fas fa-ban"></i>
                                                            </button>
                                                        )}
                                                        <button className="btn btn-primary" style={{ float: 'right', marginRight: '7px' }} onClick={() => handleButtonOpen(subgreddiit._id)}>Open</button>
                                                    </>
                                                ) : (
                                                    <button className="btn btn-primary" style={{ float: 'right' }} onClick={() => joinSubGreddiit(subgreddiit._id)}>Join</button>
                                                )}

                                            </div>
                                            <div className="quote-container">
                                                <div className="quote-container">
                                                    <p>Created By: {subgreddiit.createdBy}</p>
                                                    <p>Description: {subgreddiit.description}</p>
                                                    <p>Banned Keywords: {subgreddiit.bannedKeywords.join(", ")}</p>
                                                    <p>Number of Posts: {subgreddiit.postCount}</p>
                                                    <p>Followers: {subgreddiit.followers.length}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))) : (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                                        <h2 className="titleChange">No Sub Greddiits to show.</h2>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div style={{ marginTop: "-50px" }}>
                                    <div className="hdng">
                                        <h1>Joined Sub Greddiits</h1>
                                    </div>
                                    {allSubGreddiits.filter(subgreddiit => subgreddiit.followers.includes(userId)).length > 0 ? (allSubGreddiits.filter((subgreddiit) => subgreddiit.followers.includes(userId)).map((subgreddiit) => (
                                        <div className="Qcontainer" id="quote-content" key={subgreddiit.name}>
                                            <div>
                                                <div className="quote-nav">
                                                    <h2 id="titleQ">{subgreddiit.name}</h2>
                                                    {!isSubgreddiitCreator(subgreddiit.createdBy) && (
                                                        <button className="btn btn-primary" style={{ float: 'right' }} onClick={() => handleLeave(subgreddiit._id)}>
                                                            Leave
                                                        </button>
                                                    )}
                                                    {isSubgreddiitCreator(subgreddiit.createdBy) && (
                                                        <button className="btn btn-primary" style={{ float: 'right', cursor: 'not-allowed' }}> Leave
                                                            <i className="fas fa-ban"></i>
                                                        </button>
                                                    )}
                                                    <button className="btn btn-primary" style={{ float: 'right', marginRight: '7px' }} onClick={() => handleButtonOpen(subgreddiit._id)}>Open</button>
                                                    <br /><br />
                                                </div>
                                                <div className="quote-container">
                                                    <p>Created By: {subgreddiit.createdBy}</p>
                                                    <p>Description: {subgreddiit.description}</p>
                                                    <p>Banned Keywords: {subgreddiit.bannedKeywords.join(", ")}</p>
                                                    <p>Number of Posts: {subgreddiit.postCount}</p>
                                                    <p>Followers: {subgreddiit.followers.length}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))) : (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '15vh' }}>
                                            <h2 className="titleChange">You have not joined any Sub Greddiits</h2>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="hdng">
                                        <h1>Remaining Sub Greddiits</h1>
                                    </div>
                                    {allSubGreddiits.filter(subgreddiit => !subgreddiit.followers.includes(userId)).length > 0 ? (
                                        allSubGreddiits.filter(subgreddiit => !subgreddiit.followers.includes(userId)).map(subgreddiit => (
                                            <div className="Qcontainer" id="quote-content" key={subgreddiit.name}>
                                                <div>
                                                    <div className="quote-nav">
                                                        <h2 id="titleQ">{subgreddiit.name}</h2>
                                                        <button className="btn btn-primary" style={{ float: 'right' }} onClick={() => joinSubGreddiit(subgreddiit._id)}>Join</button>
                                                        <br /><br />
                                                    </div>
                                                    <div className="quote-container">
                                                        <p>Created By: {subgreddiit.createdBy}</p>
                                                        <p>Description: {subgreddiit.description}</p>
                                                        <p>Banned Keywords: {subgreddiit.bannedKeywords.join(", ")}</p>
                                                        <p>Number of Posts: {subgreddiit.postCount}</p>
                                                        <p>Followers: {subgreddiit.followers.length}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '15vh' }}>
                                            <h2 className="titleChange">No remaining subgreddiits</h2>
                                        </div>
                                    )}

                                </div>

                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default AllSubGreddiit;