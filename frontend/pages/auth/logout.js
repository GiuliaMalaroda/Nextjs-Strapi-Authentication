import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
    const { push } = useRouter();

    useEffect(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
        push('/');
    }, [push]);

    return <></>;
}

export default Logout;