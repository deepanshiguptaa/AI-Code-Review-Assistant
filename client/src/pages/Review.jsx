import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

const Review = () => {

  const { owner, repo, sha } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    api.get(`/ai/review?owner=${owner}&repo=${repo}&sha=${sha}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setReview(res.data))
    .catch(err => console.log(err));

  }, [owner, repo, sha]);

  if (!review) return <div className="loader">🔍 Reviewing commit...</div>;
    const high = review.issues.filter(i => i.severity === "High").length;
    const medium = review.issues.filter(i => i.severity === "Medium").length;
    const low = review.issues.filter(i => i.severity === "Low").length;

    const total = high + medium + low;

    // weighted risk formula
    const riskScore = Math.min(
    100,
    Math.round(((high * 5) + (medium * 3) + (low * 1)) * 4)
    );

    let riskLabel = "Low Risk";
    let riskColor = "#16a34a";

    if (riskScore > 70) {
        riskLabel = "High Risk";
        riskColor = "#dc2626";
    }
    else if (riskScore > 40) {
        riskLabel = "Medium Risk";
        riskColor = "#f59e0b";
    }

  return (
    <div className="app">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>AI Reviewer</h2>
        <p><b>Repo:</b> {repo}</p>
        <p><b>Owner:</b> {owner}</p>
      </div>

      {/* Main */}
      <div className="main">
            <div className="card">
            <h2>Commit Risk Analysis</h2>

            <div style={{ fontSize: "26px", fontWeight: "bold", color: riskColor }}>
                {riskScore}% — {riskLabel}
            </div>

            <div style={{ marginTop: "10px" }}>
                <span className="badge high">High: {high}</span>
                <span className="badge medium">Medium: {medium}</span>
                <span className="badge low">Low: {low}</span>
            </div>

            <p style={{ marginTop: "10px", color: "#64748b" }}>
                AI evaluated this commit based on bug probability, security risks and maintainability.
            </p>
        </div>

        <div className="card">
          <h2>Summary</h2>
          <p>{review.summary}</p>
        </div>

        <div className="card">
          <h2>Issues</h2>

          {review.issues.length === 0 && <p>No issues 🎉</p>}

          {review.issues.map((issue, index) => {

            const level = issue.severity?.toLowerCase() || "low";

            return (
              <div key={index} className={`issue ${level}`}>
                <span className={`badge ${level}`}>{issue.severity}</span>
                <b>{issue.type}</b>
                <p><b>File:</b> {issue.file}</p>
                <p>{issue.message}</p>
                <p><i>Fix: {issue.suggestion}</i></p>
              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default Review;
