import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            <div className="logo">VICTVS tech test</div>
            <nav>
                <Link to="/">Exam Sessions</Link>
                <Link to="/locations">Locations</Link>
            </nav>
        </header>
    );
}