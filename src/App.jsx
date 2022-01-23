import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./Home";
import AIEditor from "./AIEditor";
import ConfigEditor from './ConfigEditor';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<AIEditor />} />
        <Route path="/config" element={<ConfigEditor />} />
      </Routes>
    </Router>
  );
}
