import React, { useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { Navigate } from 'react-router-dom'
import { db } from './firebase-config';
import ImageUpload from "./Components/ImageUpload";
import './App.css'
import Post from './Components/Post'
import { collection, onSnapshot, orderBy } from 'firebase/firestore';
import { useStateContext } from './contexts/Context';
import { Avatar } from '@mui/material'
import { InstagramEmbed } from 'react-social-media-embed'

export default function Home() {
    const { currentUser } = useStateContext();
    const [posts, setPosts] = useState([]);
    const [accounts, setAccount] = useState([])

    useEffect(() =>
        onSnapshot(collection(db, 'posts'), (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        })
        , []
    )

    const allPosts = posts.map((post) => {
        return <Post key={post.id} avatar={post.avatar} postId={post.id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
    })

    if (!currentUser) {
        return <Navigate to='/' />
    }

    return (
        <div className='posts__container'>
            <div className='app__posts'>{allPosts}</div>
            <div className="suggested" style={{ maxWidth: '400px', paddingTop: '20px' }}>
                <InstagramEmbed
                    url="https://www.instagram.com/p/CiftPJojOjx/?igshid=YmMyMTA2M2Y"
                    maxWidth={328} />
            </div>
        </div>
    )
}