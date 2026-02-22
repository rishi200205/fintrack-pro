import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const result = await dispatch(
            loginUser({ email: 'alex@fintrack.pro', password: 'demo1234' })
        );
        if (loginUser.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <>
            <h1>Login Page</h1>
            <button onClick={handleLogin}>Mock Login</button>
        </>
    );
}