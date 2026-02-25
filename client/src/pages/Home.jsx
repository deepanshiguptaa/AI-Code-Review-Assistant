const Home = () => {

  const login = () => {
    window.location.href = "http://localhost:5000/auth/github/login";
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      color: "white"
    }}>

      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
        AI Code Review Assistant
      </h1>

      <p style={{ marginBottom: "40px", opacity: 0.8 }}>
        Analyze GitHub commits with AI powered feedback
      </p>

      <button
        onClick={login}
        style={{
          padding: "14px 26px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          background: "#22c55e",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Login with GitHub
      </button>

    </div>
  );
};

export default Home;
