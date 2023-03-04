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
    faComment,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import greddiit from "./Images/greddiit-logo.png"

export const Page = (props) => {
    const { subGreddiitId } = useParams();
    const [subGreddiit, setSubGreddiit] = useState({});
    const [loading, setLoading] = useState(false);
    const [creatingPost, setPostLoading] = useState(false);
    const [showPostModal, setPostModal] = useState(false);
    const [commentModal, setCommentModal] = useState(false);
    const [reportModal, setReportModal] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [concern, setConcern] = useState('');
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const token = localStorage.getItem('token');

    if (!token) {
        const message = document.createElement('p');
        message.textContent = 'You are not logged in.';
        document.body.appendChild(message);
    }

    const decoded = jwt_decode(token);
    const username = decoded.username;
    const id = decoded.id;

    const handleCreatePost = () => {
        setPostModal(true);
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
                setSubGreddiit(data);
            }
            catch (error) {
                console.log(error);
            }
        };
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/posts/${subGreddiitId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                setPosts(data);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSubGreddiit();
        fetchPosts();
    }, [subGreddiitId, commentModal]);

    const handlePostSubmit = async () => {
        try {
            setPostLoading(true);
            setPostModal(false);
            const response = await fetch(`http://localhost:8000/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, user: id, userName: username, subGreddit: subGreddiitId }),
            });
            const data = await response.json();
            if (data.message === 'Used Banned Keywords') {
                alert('Your post contains keywords which are banned in this subgreddiit');
            }
            if(data.message === 'Data is missing'){
                alert('Data is missing');
            }
            window.location.reload();
        } catch (error) {
            console.log(error);
            // Handle the error and display it to the user
        }
        finally {
            setPostLoading(false);
        }
    };

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
                body: JSON.stringify({ userId: id })
            });
            const data = await response.json();
            console.log(data);
            if (data.message === 'Already saved') {
                alert('You have already saved this post');
            }

            if (data.message === 'Post Saved successfully') {
                alert('Post Saved!');
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
                body: JSON.stringify({ userId: id })
            });

            const data = await response.json();

            console.log(data);

            if (data.message === 'Already upvoted') {
                alert('You have already upvoted this post');
            }

            if (data.message === 'Upvoted successfully') {
                alert('Thank you for upvoting!');
            }

            setPosts((prevPosts) => {
                const updatedPosts = prevPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, upvotedBy: [...post.upvotedBy, id] };
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
                body: JSON.stringify({ userId: id })
            });

            const data = await response.json();

            console.log(data);

            if (data.message === 'Already downvoted') {
                alert('You have already downvoted this post');
            }

            if (data.message === 'Downvoted successfully') {
                alert('You downvoted this post successfully');
            }

            setPosts((prevPosts) => {
                const updatedPosts = prevPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, downvotedBy: [...post.downvotedBy, id] };
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

    const handleRequestOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/requests`;
    };

    const handleReportsOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/reports`;
    };

    const handleUsersOpen = (subGreddiitId) => {
        window.location.href = `http://localhost:3000/subgreddiit/${subGreddiitId}/users`;
    };

    const addComment = async (postId, event) => {
        event.preventDefault();
        try {
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
            else if(data.message === 'Data is missing'){
                alert('Data is missing');
            }
            else {
                alert('Error');
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    const fetchComments = async (postId) => {
        try {
            // console.log(postId)
            const response = await fetch(`http://localhost:8000/api/posts/comments/${postId}/getComments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
            })
            const data = await response.json();
            setComments(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFollow = async (user) => {
        try {
            const creatorId = user._id;
            const responseFollow = await fetch(`http://localhost:8000/api/user/${creatorId}/followers`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ followerId: id }),
            })
            const dataFollow = await responseFollow.json();
            console.log(dataFollow);

            const responseFollowing = await fetch(`http://localhost:8000/api/user/${id}/following`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ followingId: creatorId }),
            })

            const dataFollowing = await responseFollowing.json();
            console.log(dataFollowing);

            console.log(dataFollow.message);
            console.log(dataFollowing.message);
            if (dataFollow.message === 'Followed successfully' && dataFollowing.message === 'Following added successfully') {
                alert(`Followed ${user.firstName} Successfully`);
            }
            else if (dataFollow.message === 'User is already a follower.' || dataFollowing.message === 'User is already following.') {
                alert(`You already follow ${user.firstName}`)
            }
            else if (dataFollow.message === 'You cannot follow yourself.' || dataFollowing.message === 'You cannot follow yourself.') {
                alert('You cannot follow yourself!');
            }
            else {
                alert('Error! Cannot follow');
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    const handleReport = async (post, concern, event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/reports/${subGreddiitId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    reportedBy: id,
                    reportedUser: post.user,
                    concern: concern,
                    post: post,
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
            else if (data.message === 'You cannot report your own post.') {
                alert('You cannot report your own post.');
            }
            else if(data.message === 'Data is missing'){
                alert('Data is missing');
            }
            else {
                alert('Error.')
            }
            setReportModal(false);
            setConcern('');
            window.location.reload();
        }
        catch (error) {
            console.log('Error reporting:', error);
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
                                {username === subGreddiit.createdBy && (
                                    <>
                                        <Nav.Link href="#" onClick={() => handleUsersOpen(subGreddiit._id)}><FontAwesomeIcon icon={faUsers} color="black" /> Users</Nav.Link>
                                        <Nav.Link href="#" onClick={() => handleRequestOpen(subGreddiit._id)}>
                                            <FontAwesomeIcon icon={faClipboardList} color="black" /> Requests
                                        </Nav.Link>
                                        <Nav.Link href="#" onClick={() => handleStatsOpen(subGreddiit._id)}><FontAwesomeIcon icon={faChartSimple} color="black" /> Stats</Nav.Link>
                                        <Nav.Link href="#" onClick={() => handleReportsOpen(subGreddiit._id)}><FontAwesomeIcon icon={faFlag} color="black" /> Reports</Nav.Link>
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
                    <h2 className="titleChange">Fetching posts...</h2>
                </div>
            )}
            {
                <div style={{ paddingTop: "60px" }}>
                    <div>
                        <div className="sidebar">
                            <div>
                                <aside className="pageImage"></aside>
                                <div className="description">
                                    <h2 className="titleChange">{subGreddiit.name}</h2>
                                    <p>{subGreddiit.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <br /><br />
                        <button className="btn btn-primary" style={{ marginLeft: "15%" }} onClick={handleCreatePost}>
                            Create Post
                        </button>
                    </div>
                    {showPostModal && (
                        <Modal
                            show={showPostModal}
                            onHide={() => setPostModal(false)}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">Create Post</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="postTitle" className="form-label">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="postTitle"
                                            value={title} onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="postText" className="form-label">
                                            Post Text
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="postText"
                                            value={content} onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-secondary" onClick={() => setPostModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handlePostSubmit}>
                                    Submit
                                </button>
                            </Modal.Footer>
                        </Modal>
                    )}
                    {showPostModal === false && (
                        <div className="postArea">
                            {posts.length > 0 ? (posts.map((post) => (
                                <div className="Qcontainer" id="quote-content" key={post._id}>
                                    <div className="quote-nav">
                                        <h2 id="titleQ">{post.title}</h2>
                                        <button className="btn btn-primary" style={{ float: 'right' }} onClick={() => handleFollow(post.user)}>Follow</button>
                                        <br /><br />
                                    </div>
                                    <div className="quote-container">
                                        <p>Created By: {post.userName}</p>
                                        <p>{post.content}</p>
                                        <button className="btn" onClick={() => handleUpvote(post._id)}>
                                            <FontAwesomeIcon icon={faThumbsUp} color="#007DFF" />
                                            <span style={{ marginLeft: '3px', marginRight: '3px' }}>{Array.isArray(post.upvotedBy) ? post.upvotedBy.length : 0}</span>
                                        </button>
                                        <button className="btn" onClick={() => handleDownvote(post._id)}>
                                            <FontAwesomeIcon icon={faThumbsDown} color="red" />
                                            <span style={{ marginLeft: '3px', marginRight: '3px' }}>{Array.isArray(post.downvotedBy) ? post.downvotedBy.length : 0}</span>
                                        </button>
                                        <button className="btn" onClick={() => { setCommentModal(true); fetchComments(post._id); setSelectedPostId(post._id); }}>
                                            <FontAwesomeIcon icon={faComment} color="black" /> Comment
                                        </button>
                                        <button className="btn" onClick={() => handleSave(post._id)}><FontAwesomeIcon icon={faBookmark} color="black" />  Save
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
                                                                id="comment"
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
                                                {isLoading ? (<div className="hdng">
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
                            ))) : (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
                                    <h2 className="titleChange">There are no posts in this Sub Greddiit...</h2>
                                </div>
                            )}
                        </div>
                    )}
                </div >
            }
        </div>

    );
};

export default Page;
