import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useStateContext } from '../contexts/Context';
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { updateProfile } from 'firebase/auth';
import { auth, storage } from '../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export default function CompleteProfile() {
    const { currentUser } = useStateContext();

    const navigate = useNavigate();

    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [next, setNext] = useState(false)
    const [preview, setPreview] = useState('https://ouch-cdn2.icons8.com/a_sd5UkdMVzcLgEHtyVFVHmaX3S8N6os66vnRG0nWNk/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNjI2/LzZjNjM0NzQxLWQ4/OWQtNGQ5OC1iZGI4/LWIxYmQ0NmFjMjc0/Zi5zdmc.png')
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (image) {
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
                        await updateProfile(auth.currentUser, { photoURL: url })
                        console.log(url)
                        setPreview(url)
                        setImage(null)
                        setProgress(0)
                        setNext(true)
                    })
                }
            )

        }

    }
    console.log(preview)
    return (
        <div className='auth__container'>
            <Card>
                <Card.Body>
                    <div className='text-center mb-4'><img className='app__header-image' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' alt='logo' /></div>
                    <p className='text-center mb-4'>You're almost done, now add a display picture...</p>
                    <div className='text-center mb-4'><img className='preview__image' src={preview} alt='logo' /></div>
                    <Form onSubmit={handleSubmit}>
                        <progress value={progress} max='100' className='image__upload-progress'></progress>
                        <Form.Group id='password-confirm'>
                            <Form.Control type='file' onChange={handleChange} required />
                        </Form.Group>
                        <Button type='submit' className='w-100 mt-4'>Upload Image</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
                <Link to='/home'>{next ? 'Next' : 'Skip'}</Link>
            </div>
        </div>
    )
}