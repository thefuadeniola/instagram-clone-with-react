import React, { useState, useEffect } from 'react'
import { db } from '../firebase-config'
import { Avatar } from '@mui/material'
import './Post.css'
import { doc, collection, docs, onSnapshot, addDoc } from 'firebase/firestore'
import { useStateContext } from '../contexts/Context'
import { FiMessageCircle, FiSend } from 'react-icons/fi'
import { AiOutlineHeart } from 'react-icons/ai'
import { FaRegBookmark } from 'react-icons/fa'

const Post = ({ postId, username, caption, imageUrl, avatar }) => {
    const { currentUser } = useStateContext()
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [showComments, setShowComments] = useState(false)
    useEffect(() => {
        if (postId) {
            const postDoc = doc(db, 'posts', postId)
            onSnapshot(collection(postDoc, 'comments'), (snapshot) => {
                setComments(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
            })
        }
    }, [postId]
    )
    const postComment = async (e) => {
        e.preventDefault();
        const postDoc = doc(db, 'posts', postId)
        const commentCollectionRef = collection(postDoc, 'comments')
        await addDoc(commentCollectionRef, { username: currentUser.displayName, comment: comment })
        setComment('')
    }
    const commentSection = comments.map((comment) => {
        return (
            <p key={comment.id} className='comment'>
                <strong>{comment.username}</strong> {comment.comment}
            </p>
        )
    })

    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar
                    className='post_avatar' alt={username}
                    src={avatar}
                />
                <h3>{username}</h3>
            </div>
            <img className='post__image' src={imageUrl} alt={username} />
            <div className='like__container'>
                <div className='like__flex'>
                    <AiOutlineHeart className='icon' />
                    <FiMessageCircle onClick={() => { setShowComments((oldShow) => !oldShow) }} className='icon' />
                    <FiSend className='icon' />
                </div>
                <div className='like__flex2'>
                    <FaRegBookmark className='icon' />
                </div>
            </div>
            <h4 className='post__text'><strong>{username}</strong> {caption}</h4>
            {showComments &&
                <>
                    {commentSection}
                    <form className='post__comment-box'>
                        <input className='post__input'
                            type='text'
                            placeholder='Add a comment...'
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className='post__button'
                            disabled={!comment}
                            type='submit'
                            onClick={postComment}>Post
                        </button>
                    </form>
                </>
            }
        </div>
    )
}

export default Post