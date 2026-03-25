import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const Commits = () => {

  const { owner, repo } = useParams();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    api.get(`/github/commits?owner=${owner}&repo=${repo}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCommits(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    });

  }, [owner, repo]);

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
      <div style={{ maxWidth: "900px", margin: "auto" }}>

        {/* Back Button */}
        <button
          onClick={() => navigate("/repos")}
          style={{
            marginBottom: "25px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "8px 14px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer"
          }}
        >
          ← Back to Repositories
        </button>

        {/* Header */}
        <h1 style={{ fontSize: "34px", marginBottom: "5px" }}>
          {repo}
        </h1>

        <p style={{ opacity: 0.7 }}>
          Commit history — run AI analysis on any commit
        </p>

        {/* Loading */}
        {loading && (
          <p style={{ marginTop: "40px", opacity: 0.7 }}>
            Loading commits...
          </p>
        )}

        {/* Commit List */}
        <div style={{ marginTop: "35px" }}>

          {commits.map(commit => (

            <div
              key={commit.sha}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "22px",
                borderRadius: "14px",
                marginBottom: "18px",
                transition: "all 0.25s ease",
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >

              <div>

                {/* Commit message */}
                <h3 style={{ marginBottom: "6px" }}>
                  {commit.message}
                </h3>

                {/* Author + Date */}
                <p
                  style={{
                    fontSize: "14px",
                    opacity: 0.7,
                    marginBottom: "6px"
                  }}
                >
                  {commit.author} • {new Date(commit.date).toLocaleString()}
                </p>

                {/* SHA badge */}
                <span
                  style={{
                    fontSize: "12px",
                    background: "rgba(255,255,255,0.08)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    opacity: 0.8
                  }}
                >
                  {commit.sha.slice(0, 8)}
                </span>

              </div>

              {/* AI Review Button */}
              <button
                onClick={() =>
                  navigate(`/review/${owner}/${repo}/${commit.sha}`)
                }
                style={{
                  padding: "10px 18px",
                  background: "#22c55e",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "0.2s"
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "#16a34a")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "#22c55e")
                }
              >
                AI Review
              </button>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
};

export default Commits;