import React, { useContext, createContext, useState, useLayoutEffect } from 'react'
import { auth } from '../firebase-config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();

    const signup = async (username, email, password) => {
        const template = 'https://ouch-cdn2.icons8.com/a_sd5UkdMVzcLgEHtyVFVHmaX3S8N6os66vnRG0nWNk/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNjI2/LzZjNjM0NzQxLWQ4/OWQtNGQ5OC1iZGI4/LWIxYmQ0NmFjMjc0/Zi5zdmc.png'
        try {
            await createUserWithEmailAndPassword(auth, email, password).catch((err) =>
                console.log(err)
            );
            await updateProfile(auth.currentUser, { displayName: username, photoURL: template }).catch(
                (err) => console.log(err)
            );
        } catch (err) {
            console.log(err);
        }
    };

    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        auth.signOut()
    }

    const resetPassword = (email) => {
        return sendPasswordResetEmail(email)
    }

    useLayoutEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })
        return unsubscribe;
    }, [])

    console.log(currentUser)

    return (
        <AuthContext.Provider value={{
            currentUser, setCurrentUser, signup, login, logout, resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useStateContext = () => useContext(AuthContext)