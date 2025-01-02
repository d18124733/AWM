import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection

// alternative to jquery
axios.defaults.withCredentials = true;

// like login.html from django template, handles logging in
const Login = ({ setUser }) => {
    const [csrfToken, setCsrfToken] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // fetch csrf token for logging in
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get("/api/csrf/");
                setCsrfToken(response.data.csrfToken);
            } catch (err) {
                console.error("Failed to fetch CSRF token", err);
            }
        };

        fetchCsrfToken();
    }, []);

    // log in functionality
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append("csrfmiddlewaretoken", csrfToken);
            formData.append("username", username);
            formData.append("password", password);
    
            const response = await axios.post(
                "/api/login/",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true, 
                }
            );
            setUser({ isAuthenticated: true, username: response.data.username }); 
            navigate("/"); 
        } catch (err) {
            console.error("Login failed", err);
            setError("Login failed. Please check your credentials and try again.");
        }
    };

    // html
    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h2 className="text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <p className="text-center mt-3">
                    Don&#39;t have an account? <a href="/signup">Sign up here</a>.
                </p>
            </div>
        </div>
    );
};

export default Login;
