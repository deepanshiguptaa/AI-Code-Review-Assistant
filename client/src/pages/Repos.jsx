import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";

const Repos = () => {

  const [repos, setRepos] = useState([]);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {

    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, document.title, "/repos");
    }

    const token = localStorage.getItem("token");

    api.get("/github/repos", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setRepos(res.data))
    .catch(err => console.log(err));

  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #1e293b, #020617)",
        color: "white",
        padding: "50px 30px",
        fontFamily: "system-ui"
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          Select Repository
        </h1>

        <p style={{ opacity: 0.7 }}>
          Choose a GitHub repository to analyze commits with AI.
        </p>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "22px",
            marginTop: "35px"
          }}
        >

          {repos.map(repo => (

            <div
              key={repo.id}
              onClick={() => navigate(`/commits/${repo.owner}/${repo.name}`)}
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0,0,0,0.3)";
              }}
            >

              {/* Repo name */}
              <h3 style={{ marginBottom: "8px" }}>
                📦 {repo.name}
              </h3>

              {/* Owner */}
              <p
                style={{
                  fontSize: "14px",
                  opacity: 0.7,
                  marginBottom: "10px"
                }}
              >
                Owner: {repo.owner}
              </p>

              {/* Badge */}
              <span
                style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: repo.private ? "#ef4444" : "#22c55e",
                  color: "white"
                }}
              >
                {repo.private ? "Private" : "Public"}
              </span>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Repos;