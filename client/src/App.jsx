import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Repos from "./pages/Repos";
import Commits from "./pages/Commits";
import Review from "./pages/Review";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/repos" element={<Repos />} />
      <Route path="/commits/:owner/:repo" element={<Commits />} />
      <Route path="/review/:owner/:repo/:sha" element={<Review />} />
    </Routes>
  );
}

export default App;
