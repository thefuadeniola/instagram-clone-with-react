import React, { useState } from 'react'
import { Button } from '@mui/material'
import { storage, db } from '../firebase-config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useStateContext } from '../contexts/Context'
import './ImageUpload.css'

const ImageUpload = () => {
    const { currentUser } = useStateContext();
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    //    const [url, setUrl] = useState('')
    const [progress, setProgress] = useState(0)
    const postsCollectionRef = collection(db, 'posts')

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        if (!image) {
            alert('Choose an image to upload!')
        }
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
                    await addDoc(postsCollectionRef, {
                        timestamp: serverTimestamp(),
                        avatar: currentUser.photoURL,
                        username: currentUser.displayName,
                        imageUrl: url,
                        caption: caption
                    })
                    setProgress(0);
                    setCaption('');
                    setImage(null)
                })
            }
        )
    }

    return (
        <div className='image__upload'>
            <progress value={progress} max='100' className='image__upload-progress'></progress>
            <input type='text' placeholder='Enter a caption...' onChange={(e) => setCaption(e.target.value)} value={caption} />
            <input type='file' onChange={handleChange} accept='.jpg, .png, .jfif, .jpeg, .gif' />
            <Button className='image__upload-button' onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload