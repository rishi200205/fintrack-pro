import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate("/dashboard");
    };

    return (
        <>
            <h1>Login Page</h1>
            <button onClick={handleLogin}>Mock Login</button>
        </>
    );
}