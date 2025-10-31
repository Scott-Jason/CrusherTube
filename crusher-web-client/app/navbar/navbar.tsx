import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";

export default function Navbar(){
    return (
        <nav className={styles.logo}>
            <Link href="/">
                
                <Image width={90} height={80} src="/climb.svg" alt="climb logo"/>
            
                
            </Link>
            
        </nav>

    );
}