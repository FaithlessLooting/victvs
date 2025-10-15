import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Components/Header";
import ExamSession from "./Pages/ExamSession";
import Locations from "./Pages/Locations";

import '../css/app.css';

ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<ExamSession />} />
                <Route path="/locations" element={<Locations />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);