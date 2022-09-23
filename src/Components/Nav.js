import React, { useState } from "react";
import { Outlet } from 'react-router-dom'
import { useStateContext } from "../contexts/Context";
import { Avatar } from '@mui/material'
import { Input, InputAdornment } from '@mui/material';
import { GrHomeRounded } from 'react-icons/gr'
import { FiMessageCircle } from 'react-icons/fi'
import { CgAddR } from 'react-icons/cg'
import { FaRegCompass } from 'react-icons/fa'
import { AiOutlineHeart } from 'react-icons/ai'
import { Backdrop, Box, Modal, Fade, Button, Typography } from '@mui/material';
import { db, storage } from '../firebase-config'
import { collection, serverTimestamp, addDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 'fit-content',
    bgcolor: 'background.paper',
    border: 0,
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
};

export default function Nav() {
    const { currentUser, logout } = useStateContext();
    const [authOptions, setAuthOptions] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [image, setImage] = useState(null)
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleSubmit = () => {

        if (!image) {
            alert('Select an image to upload!')
        }
        else {
            const storageRef = ref(storage, `images/${image.name}`)
            const uploadTask = uploadBytesResumable(storageRef, image)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(percent)
                },
                (err) => console.log(err),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                        const postsCollectionRef = collection(db, 'posts')
                        await addDoc(postsCollectionRef, {
                            timestamp: serverTimestamp(),
                            avatar: currentUser.photoURL,
                            username: currentUser.displayName,
                            imageUrl: url,
                            caption: caption

                        })
                        setPreview(url)
                        setImage(null)
                        setCaption('')
                        setOpen(false)
                    })
                }
            )

        }

    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [preview, setPreview] = useState('https://t3.ftcdn.net/jpg/04/41/89/74/240_F_441897440_ZUbcIXGln6gzsYt5q0QDkzmdj9utpEg3.jpg')

    const showOptions = () => {
        setAuthOptions((oldAuth) => !oldAuth)
    }

    const signOut = async () => {
        await logout()
        navigate('/')
    }

    return (
        <>
            <div className="app__header">
                <div className="logo__container">
                    <img className='app__header-image' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' alt='logo' />
                </div>
                <input className='search__bar' placeholder="Search" />
                <div className="options">
                    <div className="auth__options">
                        <GrHomeRounded className='icon' title="Home" />
                        <FiMessageCircle className='icon' title="Messages" />
                        <CgAddR className='icon' title="Add Post" onClick={handleOpen} />
                        <FaRegCompass className='icon' title="Find" />
                        <AiOutlineHeart className='icon' title="Notifications" />
                    </div>
                    {currentUser && <Avatar className="post_avatar" alt={currentUser.displayName} src={currentUser.photoURL} onClick={showOptions} />}
                </div>
            </div>
            {authOptions && <div className="logout">
                <div className="logout__option" onClick={signOut}>Log Out</div>
                <div className="logout__option" onClick={handleOpen}>Add Post</div>
            </div>}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" className='upload'>
                            <img className='app__header-image' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' alt='logo' />
                        </Typography>
                        <div style={{ height: '200px', padding: '20px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <img src={preview} alt='' />
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '20px' }} >
                            <input type='file' accept='.jpg, .png, .jfif, .jpeg, .gif' onChange={handleChange} />
                            <input type='text' placeholder='Enter a caption...' style={{ marginTop: '8px' }} onChange={(e) => setCaption(e.target.value)} value={caption} />

                        </div>
                        <Button className='image__upload-button' onClick={handleSubmit}>
                            Upload
                        </Button>
                    </Box>
                </Fade>
            </Modal>

            <Outlet />
        </>
    )
}