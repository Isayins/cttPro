import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Downloads from "../pages/Download";
import Tools from "../pages/Tools";
import VerifyDownload from "../pages/VerifyDownload";

export default function RouterConfig() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/verify" element={<VerifyDownload />} />
    </Routes>
  );
}
