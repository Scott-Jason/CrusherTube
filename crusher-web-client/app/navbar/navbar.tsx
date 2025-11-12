'use client';

import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
import Upload from "./upload"

import SignIn from "./sign-in"
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";

//closure state inside func still maintained after function ends

export default function Navbar(){
    //Init user state
    const [user, setUser] = useState<User | null>(null);
    useEffect( () => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });
        //cleanup subscription on unmount
        return () => unsubscribe();
    });


    return (
        <nav className={styles.logo}>
            <Link href="/">
                <Image width={90} height={80} src="/climb.svg" alt="climb logo"/>                
            </Link>
            
            <Upload />
            
            <SignIn user={user}/>
            
        </nav>

    );
}