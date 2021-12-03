import { useState, useEffect } from 'react';
import Link from 'next/link';

const Homepage = () => {
    const [isLogged, setIsLogged] = useState();

    useEffect(() => {
        setIsLogged(!!localStorage.getItem('jwt'));
    }, []);

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Homepage 🏡</h1>
            <hr />
            <nav>
                <ul style={{ display: "flex", columnGap: "20px", justifyContent: "end" }}>
                    {!isLogged && ( 
                        <li>
                            <Link href="/auth/register">
                                <a>Register</a>
                            </Link>
                        </li>
                    )}
                    <li>
                        {!isLogged ? (
                            <Link href="/auth/login">
                                <a>Login</a>
                            </Link>
                        ) : (
                            <Link href="/auth/logout">
                                <a>Logout</a>
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
            <hr />
            <main>
                {isLogged ? (
                    <p>👋🏼 &nbsp;Welcome back, <b>{localStorage.username}</b>!</p>
                ) : (
                    <>
                        <p>You are not logged in, yet.</p>
                        <p>Log in to see something here.</p>
                    </>
                )}
            </main>
        </>
    )
}

export default Homepage;