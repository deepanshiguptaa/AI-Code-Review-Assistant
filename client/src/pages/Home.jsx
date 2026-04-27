const Home = () => {

  const login = () => {
    window.location.href = "https://ai-code-review-assistant-7xl9.onrender.com/api/github/login";
  };

  return (
    <div
      style={{
        height: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, #1e293b, #020617)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "white",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "18px",
          padding: "60px 50px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)"
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "10px",
            letterSpacing: "-1px"
          }}
        >
          AI Code Review
        </h1>

        {/* Subtitle */}
        <p
          style={{
            opacity: 0.7,
            fontSize: "15px",
            marginBottom: "40px",
            lineHeight: "1.6"
          }}
        >
          Automatically analyze GitHub commits and pull requests  
          using intelligent AI feedback.
        </p>

        {/* Login Button */}
        <button
          onClick={login}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            fontSize: "16px",
            border: "none",
            background: "#24292e",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.25s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#22c55e";
            e.target.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#24292e";
            e.target.style.transform = "scale(1)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.165c-3.338.725-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.082-.729.082-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.833 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.466-1.334-5.466-5.931 0-1.311.468-2.382 1.235-3.221-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.301 1.23a11.51 11.51 0 013.003-.404c1.018.005 2.044.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.649.242 2.873.118 3.176.77.839 1.233 1.91 1.233 3.221 0 4.609-2.805 5.624-5.479 5.921.43.371.814 1.102.814 2.222v3.293c0 .322.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.373-12-12-12z"/>
          </svg>

          Continue with GitHub
        </button>

        {/* Features */}
        <div
          style={{
            marginTop: "35px",
            fontSize: "13px",
            opacity: 0.6,
            lineHeight: "1.7"
          }}
        >
          ⚡ AI powered code review <br />
          🔍 Detect bugs & security issues <br />
          🚀 Analyze commits & pull requests instantly
        </div>
      </div>
    </div>
  );
};

export default Home;