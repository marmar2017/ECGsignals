import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import EcgChart from "./Pages/EcgChart";
import Home from "./Pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/ecgchart" element={<EcgChart />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
