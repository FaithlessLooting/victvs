import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ExamSession() {
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dateFilter, setDateFilter] = useState("");
    const [candidateFilter, setCandidateFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const [sortBy, setSortBy] = useState(""); // "date" | "candidate" | "location"
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

    useEffect(() => {
        async function loadExams() {
            try {
                const response = await axios.get("/api/exams");
                setExams(response.data);
                setFilteredExams(response.data);
            } catch (error) {
                console.error("Failed to fetch exams", error);
            } finally {
                setLoading(false);
            }
        }
        loadExams();
    }, []);

    // Filters
    useEffect(() => {
        const filtered = exams.filter((exam) => {
            const matchDate = dateFilter
                ? new Date(exam.datetime).toISOString().startsWith(dateFilter)
                : true;

            const matchCandidate = candidateFilter
                ? exam.candidates.some(c => c.name.toLowerCase().includes(candidateFilter.toLowerCase()))
                : true;

            const matchLocation = locationFilter
                ? exam.location?.country.toLowerCase().includes(locationFilter.toLowerCase())
                : true;

            return matchDate && matchCandidate && matchLocation;
        });

        setFilteredExams(filtered);
    }, [dateFilter, candidateFilter, locationFilter, exams]);

    // Sorting
    const sortedExams = [...filteredExams].sort((a, b) => {
        if (!sortBy) return 0;

        let aValue, bValue;

        switch (sortBy) {
            case "date":
                aValue = new Date(a.datetime);
                bValue = new Date(b.datetime);
                break;
            case "candidate":
                aValue = a.candidates[0]?.name?.toLowerCase() || "";
                bValue = b.candidates[0]?.name?.toLowerCase() || "";
                break;
            case "location":
                aValue = a.location?.country?.toLowerCase() || "";
                bValue = b.location?.country?.toLowerCase() || "";
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const handleStatusChange = async (examId, newStatus) => {
        try {
            const response = await axios.patch(`/api/exams/${examId}/status`, { status: newStatus });

            setExams(prev =>
                prev.map(e => e.id === examId ? response.data : e)
            );
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (loading) return <p>Loading exams...</p>;

    return (
        <div className="page-container">
            <h1>Exam Sessions</h1>

            {/* Filters */}
            <div className="filters">
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
                <input type="text" placeholder="Candidate name" value={candidateFilter} onChange={e => setCandidateFilter(e.target.value)} />
                <input type="text" placeholder="Location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
            </div>

            {/* Sorting */}
            <div className="sorting" style={{ margin: "1rem 0" }}>
                <label>Sort by: </label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="">Default</option>
                    <option value="date">Date</option>
                    <option value="candidate">Candidate</option>
                    <option value="location">Location</option>
                </select>

                {sortBy && (
                    <>
                        <label style={{ marginLeft: "1rem" }}>Order: </label>
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </>
                )}
            </div>

            {sortedExams.length === 0 && <p>No exams found.</p>}

            {sortedExams.map((exam) => (
                <div key={exam.id} className="exam-card">
                    <h2>{exam.title}</h2>
                    <p><strong>Date:</strong> {new Date(exam.datetime).toLocaleString()}</p>
                    <p><strong>Status:</strong> 
                        <select
                            value={exam.status}
                            onChange={e => handleStatusChange(exam.id, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="started">Started</option>
                            <option value="finished">Finished</option>
                        </select>
                    </p>
                    <p><strong>Language:</strong> {exam.language}</p>
                    <p><strong>Location:</strong> {exam.location?.country || "Unknown"}</p>
                    <p><strong>Candidates:</strong> {exam.candidates?.map(c => c.name).join(", ") || "None"}</p>
                </div>
            ))}
        </div>
    );
}
