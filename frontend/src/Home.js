import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token, redirect to login
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user profile
    fetch("http://localhost:5003/api/auth/profile", {
      headers: {
        "Authorization": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Invalid or expired token") {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setUser(data); // { id, name, email }
        }
      })
      .catch(() => {
        setError("Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="main">
      <div className="navigation-bar"></div>

      <div className="body">
        <h2>Welcome {user?.name}</h2>
        <p>This is your email: <strong>{user?.email}</strong></p>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
