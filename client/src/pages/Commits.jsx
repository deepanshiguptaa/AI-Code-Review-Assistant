import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const Commits = () => {

  const { owner, repo } = useParams();
  const [commits, setCommits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    api.get(`/github/commits?owner=${owner}&repo=${repo}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCommits(res.data))
    .catch(err => console.log(err));

  }, [owner, repo]);

    return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>

        <h1>{repo} — Commits</h1>

        <div style={{ marginTop: "30px" }}>

        {commits.map(commit => (
            <div
            key={commit.sha}
            style={{
                background: "white",
                padding: "18px",
                borderRadius: "10px",
                marginBottom: "18px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.07)"
            }}
            >
            <h3>{commit.message}</h3>

            <p style={{ color: "#64748b", fontSize: "14px" }}>
                {commit.author} • {new Date(commit.date).toLocaleString()}
            </p>

            <button
                onClick={() => navigate(`/review/${owner}/${repo}/${commit.sha}`)}
                style={{
                marginTop: "10px",
                padding: "8px 14px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
                }}
            >
                AI Review
            </button>
            </div>
        ))}

        </div>
    </div>
    );

};

export default Commits;
