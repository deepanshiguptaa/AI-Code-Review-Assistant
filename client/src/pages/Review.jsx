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

  if (!review) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "white",
        fontSize: "18px"
      }}>
        🔍 AI analyzing commit...
      </div>
    );
  }

  const high = review.issues.filter(i => i.severity === "High").length;
  const medium = review.issues.filter(i => i.severity === "Medium").length;
  const low = review.issues.filter(i => i.severity === "Low").length;

  const riskScore = Math.min(
    100,
    Math.round(((high * 5) + (medium * 3) + (low * 1)) * 4)
  );

  let riskLabel = "Low Risk";
  let riskColor = "#16a34a";

  if (riskScore > 70) {
    riskLabel = "High Risk";
    riskColor = "#dc2626";
  } else if (riskScore > 40) {
    riskLabel = "Medium Risk";
    riskColor = "#f59e0b";
  }

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

      <div style={{ maxWidth: "1000px", margin: "auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "35px" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "6px" }}>
            AI Code Review
          </h1>

          <p style={{ opacity: 0.7 }}>
            Repository: <b>{repo}</b> • Owner: <b>{owner}</b>
          </p>

          <p style={{ opacity: 0.6, fontSize: "13px" }}>
            Commit SHA: {sha.slice(0, 8)}
          </p>
        </div>

        {/* Risk Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            borderRadius: "14px",
            padding: "30px",
            marginBottom: "25px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.5)"
          }}
        >

          <h2 style={{ marginBottom: "10px" }}>Commit Risk Analysis</h2>

          <div
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              color: riskColor
            }}
          >
            {riskScore}%
          </div>

          <div style={{ marginTop: "6px", fontSize: "18px", color: riskColor }}>
            {riskLabel}
          </div>

          <div style={{ marginTop: "15px" }}>
            <span style={{ marginRight: "12px", color: "#ef4444" }}>
              High: {high}
            </span>

            <span style={{ marginRight: "12px", color: "#f59e0b" }}>
              Medium: {medium}
            </span>

            <span style={{ color: "#22c55e" }}>
              Low: {low}
            </span>
          </div>

          <p style={{ marginTop: "12px", opacity: 0.7 }}>
            AI evaluated this commit based on bug probability,
            security risks and maintainability.
          </p>
        </div>

        {/* Summary */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "14px",
            padding: "25px",
            marginBottom: "25px"
          }}
        >
          <h2>Summary</h2>
          <p style={{ opacity: 0.8 }}>{review.summary}</p>
        </div>

        {/* Issues */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "14px",
            padding: "25px"
          }}
        >
          <h2>Detected Issues</h2>

          {review.issues.length === 0 && (
            <p style={{ marginTop: "10px" }}>No issues detected 🎉</p>
          )}

          {review.issues.map((issue, index) => {

            const color =
              issue.severity === "High"
                ? "#dc2626"
                : issue.severity === "Medium"
                ? "#f59e0b"
                : "#22c55e";

            return (
              <div
                key={index}
                style={{
                  borderLeft: `4px solid ${color}`,
                  background: "rgba(255,255,255,0.03)",
                  padding: "18px",
                  borderRadius: "8px",
                  marginTop: "15px"
                }}
              >
                <b style={{ color }}>{issue.severity}</b> — {issue.type}

                <p style={{ marginTop: "6px", fontSize: "14px" }}>
                  <b>File:</b> {issue.file}
                </p>

                <p style={{ marginTop: "5px" }}>
                  {issue.message}
                </p>

                <p style={{ marginTop: "5px", opacity: 0.7 }}>
                  💡 Fix: {issue.suggestion}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Review;