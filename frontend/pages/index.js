import Link from 'next/link';

const Homepage = () => {
    return (
        <>
            <h1 style={{ textAlign: "center" }}>Homepage 🏡</h1>
            <hr />
            <nav>
                <ul>
                    <li>
                        <Link href="/auth/register">
                            <a>Register</a>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Homepage;