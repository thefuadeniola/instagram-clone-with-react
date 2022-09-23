import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Home from './Home';
import Nav from './Components/Nav';
import Signup from './Components/Signup';
import Login from './Components/Login';
import CompleteProfile from './Components/CompleteProfile';

export default function App() {

    return (
        <div className='app'>
            <Router>
                <Routes>
                    <Route path='/home' element={<Nav />} >
                        <Route index element={<Home />} />
                    </Route>
                </Routes>
                <Container className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
                    <Routes>
                        <Route path='/' >
                            <Route index element={<Login />} />
                            <Route path='/signup' element={<Signup />} />
                            <Route path='/complete-profile' element={<CompleteProfile />} />
                        </Route>
                    </Routes>
                </Container>

            </Router>
        </div>
    )
}
