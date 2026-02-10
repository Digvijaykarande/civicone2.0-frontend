import React, { useEffect, useState } from "react";
import "../stylesheets/feedPage.css";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const FeedPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("https://civicone2-0.onrender.com/api/reports");
        const data = await res.json();

        // Your API returns { total, page, limit, reports }
        setReports(data.reports || []);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  return (
    <div className="feed-container">

      {/* Header */}
      <div className="feed-header">
        <span>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <ArrowLeft />
          </Link>
        </span>
        <h1>CivicOne Feed</h1>
      </div>

      {/* Loading */}
      {loading && <p style={{ textAlign: "center" }}>Loading reports...</p>}

      {/* Feed List */}
      <div className="feed-list">
        {reports.map((report) => (
          <div key={report._id} className="feed-card">

            {/* User Info */}
            <div className="user-info">
              <img
                src={`https://ui-avatars.com/api/?name=${report.reporter?.name || "User"}`}
                alt="User"
                className="avatar"
              />
              <div>
                <h2>{report.reporter?.name || "Anonymous"}</h2>
                <p className="date">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="location">
              <MapPin size={16} />
              <span>{report.location?.address || "Unknown location"}</span>
            </div>

            {/* Image */}
            {report.imagePath && (
              <img
                src={report.imagePath}
                alt="Issue"
                className="issue-image"
              />
            )}

            {/* Description */}
            <p className="description">{report.description}</p>

            {/* Status (optional) */}
            <p className="status">
              Status: <strong>{report.status}</strong>
            </p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
