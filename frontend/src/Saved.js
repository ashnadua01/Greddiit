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
    faThumbsUp,
    faThumbsDown,
    faComment, faTimes, faFlag
} from "@fortawesome/free-solid-svg-icons";
import greddiit from "./Images/greddiit-logo.png"

export const Saved = (props) => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [commentModal, setCommentModal] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCommentLoading, setCommentIsLoading] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [reportModal, setReportModal] = useState(false);
    const [concern, setConcern] = useState('');
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
                const response = await fetch(`http://localhost:8000/api/user/${userId}/saved`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setSavedPosts(data);
                setIsLoading(false);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleSave = async (postId) => {
        if (!postId) {
            console.error('postId is undefined');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/api/posts/${postId}/savepost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: userId })
            });
            const data = await response.json();
            window.location.reload();
            console.log(data);
            if (data.message === 'Already saved') {
                alert('You have already saved this post');
            }

            else if (data.message === 'Post Saved successfully') {
                alert('Post Saved!');
            }

            else {
                alert('Error');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpvote = async (postId) => {
        if (!postId) {
            console.error('postId is undefined');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/posts/${postId}/upvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: userId })
            });

            const data = await response.json();

            console.log(data);

            if (data.message === 'Already upvoted') {
                alert('You have already upvoted this post');
            }

            if (data.message === 'Upvoted successfully') {
                alert('Thank you for upvoting!');
            }

            setSavedPosts((prevPosts) => {
                const updatedPosts = prevPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, upvotedBy: [...post.upvotedBy, userId] };
                    }
                    return post;
                });
                return updatedPosts;
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };


    const handleDownvote = async (postId) => {
        if (!postId) {
            console.error('postId is undefined');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/posts/${postId}/downvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userId: userId })
            });

            const data = await response.json();

            console.log(data);

            if (data.message === 'Already downvoted') {
                alert('You have already downvoted this post');
            }

            if (data.message === 'Downvoted successfully') {
                alert('You downvoted this post successfully');
            }

            setSavedPosts((prevPosts) => {
                const updatedPosts = prevPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, downvotedBy: [...post.downvotedBy, userId] };
                    }
                    return post;
                });
                return updatedPosts;
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async (postId) => {
        if (!postId) {
            console.error('postId is undefined');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/api/user/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            window.location.reload();
            console.log(data);
            if (data.success) {
                setSavedPosts((prevSavedPosts) => prevSavedPosts.filter((post) => post.id !== postId));
                alert('Post removed from saved posts');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addComment = async (postId, event) => {
        event.preventDefault();
        try {
            // console.log(postId);
            const response = await fetch(`http://localhost:8000/api/posts/comments/${postId}/addComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ text: commentText })
            });
            const data = await response.json();
            console.log(data);
            // setCommentModal(false);
            if (data.message === 'Comment saved successfully') {
                alert('Comment saved successfully');
            }
            else {
                alert('Error');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchComments = async (postId) => {
        try {
            console.log(postId)
            const response = await fetch(`http://localhost:8000/api/posts/comments/${postId}/getComments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
            })
            const data = await response.json();
            setComments(data);
            setCommentIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleReport = async (post, concern, event) => {
        event.preventDefault();
        try {
            const subGreddiitId = post.subGreddit._id;
            const response = await fetch(`http://localhost:8000/api/reports/${subGreddiitId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    reportedBy: userId,
                    reportedUser: post.user,
                    concern: concern,
                    post: post._id,
                    postContent: post.originalContent
                })
            });

            const data = await response.json();
            console.log(data);
            if (data.message === 'Post reported successfully') {
                alert('Post was successfully reported.');
            }
            else if (data.message === 'You have already reported this post.') {
                alert('You have already reported this post.');
            }
            else if (data.message === 'You cannot report the owner.') {
                alert('You cannot report the owner.');
            }
            else {
                alert('Error.')
            }
            setReportModal(false);
            setConcern('');
        }
        catch (error) {
            console.log('Error reporting:', error);
        }
    }


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
            {isLoading ? (
                <div className="hdng">
                    <h3>Loading saved posts...</h3>
                </div>
            ) : (
                <div style={{ marginTop: '100px' }}>
                    {savedPosts.length === 0 ? (
                        <div className="hdng">
                            <h3>You have not saved any posts</h3>
                        </div>
                    ) : (
                        savedPosts.map((post) => (
                            <div className="Qcontainer" id="quote-content" key={post._id}>
                                <div className="quote-nav">
                                    <h2 id="titleQ">{post.title}</h2>
                                    <button className="btn btn-primary" style={{ float: 'right' }} onClick={() => handleRemove(post._id)}>
                                        Remove
                                    </button>
                                    <br /><br />
                                </div>
                                <div className="quote-container">
                                    <p>{post.content}</p>
                                    <p>Subgreddit: {post.subGreddit.name}</p>
                                    <button className="btn" onClick={() => handleUpvote(post._id)}>
                                        <FontAwesomeIcon icon={faThumbsUp} color="#007DFF" />
                                        <span style={{ marginLeft: '3px', marginRight: '3px' }}>{Array.isArray(post.upvotedBy) ? post.upvotedBy.length : 0} </span>
                                    </button>
                                    <button className="btn" onClick={() => handleDownvote(post._id)}>
                                        <FontAwesomeIcon icon={faThumbsDown} color="red" />
                                        <span style={{ marginLeft: '3px', marginRight: '3px' }}>{Array.isArray(post.downvotedBy) ? post.downvotedBy.length : 0}</span>
                                    </button>
                                    <button className="btn" onClick={() => { setCommentModal(true); fetchComments(post._id); setSelectedPostId(post._id); }}>
                                        <FontAwesomeIcon icon={faComment} color="black" /> Comment
                                    </button>
                                    <button className="btn" onClick={() => handleSave(post._id)}><FontAwesomeIcon icon={faBookmark} color="black" /> Save
                                    </button>
                                    <button className="btn" onClick={() => { setReportModal(true); setSelectedPostId(post._id); }}><FontAwesomeIcon icon={faFlag} color="black" /> Report
                                    </button>
                                    {reportModal && post._id === selectedPostId && (
                                        <div style={{ marginTop: "40px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <h4>Report</h4>
                                                <button className="btn" onClick={() => setReportModal(false)}>
                                                    <FontAwesomeIcon icon={faTimes} color="black" />
                                                </button>
                                            </div>
                                            <hr />
                                            <br />
                                            <form>
                                                <div className="mb-3">
                                                    <label htmlFor="concern" className="form-label">
                                                        Concern
                                                    </label>
                                                    <div style={{ display: "inline-block", width: "63%", marginLeft: "10px" }}>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="concern"
                                                            value={concern}
                                                            onChange={(e) => setConcern(e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        onClick={(event) => handleReport(post, concern, event)}
                                                        style={{ display: "inline-block", marginLeft: "10px" }}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    {commentModal && post._id === selectedPostId && (
                                        <div style={{ marginTop: "40px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <h4>Comment Section</h4>
                                                <button className="btn" onClick={() => setCommentModal(false)}>
                                                    <FontAwesomeIcon icon={faTimes} color="black" />
                                                </button>
                                            </div>
                                            <hr />
                                            <br />
                                            <form>
                                                <div className="mb-3">
                                                    <label htmlFor="comment" className="form-label">
                                                        Add Comment
                                                    </label>
                                                    <div style={{ display: "inline-block", width: "63%", marginLeft: "10px" }}>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="postTitle"
                                                            value={commentText}
                                                            onChange={(e) => setCommentText(e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        onClick={(event) => addComment(post._id, event)}
                                                        style={{ display: "inline-block", marginLeft: "10px" }}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </form>
                                            {isCommentLoading ? (<div className="hdng">
                                                <h3>Loading comments...</h3>
                                            </div>) : (
                                                comments.length === 0 ? (<div className="hdng">
                                                    <h3>Be the first one to comment</h3>
                                                </div>) : (
                                                    comments.map((comment) => (
                                                        <div key={comment._id} style={{ marginBottom: "10px" }}>
                                                            <span style={{ fontWeight: "bold" }}>{comment.user.username}: </span>
                                                            {comment.text}
                                                        </div>
                                                    ))
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )
            }
        </div>
    );
};

export default Saved;
