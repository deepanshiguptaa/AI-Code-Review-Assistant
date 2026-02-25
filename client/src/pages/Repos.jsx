import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";

const Repos = () => {

  const [repos, setRepos] = useState([]);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {

    // get token from URL after login
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
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>
        <h1>Select Repository</h1>

        <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "20px",
        marginTop: "30px"
        }}>

        {repos.map(repo => (
            <div
            key={repo.id}
            onClick={() => navigate(`/commits/${repo.owner}/${repo.name}`)}
            style={{
                background: "white",
                borderRadius: "12px",
                padding: "18px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
            <h3>{repo.name}</h3>
            <p style={{ color: "#64748b", fontSize: "14px" }}>
                Owner: {repo.owner}
            </p>
            </div>
        ))}

        </div>
    </div>
    );

};

export default Repos;
