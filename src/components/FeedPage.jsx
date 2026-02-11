import React, { useEffect, useState } from "react";
import "../stylesheets/feedPage.css";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const FeedPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState({});
  const [commentsData, setCommentsData] = useState({});

  /* =========================
     Fetch Reports
  ========================= */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("https://civicone2-0.onrender.com/api/reports");
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  /* =========================
     Add Comment
  ========================= */
  const handleAddComment = async (reportId) => {
    const text = commentText[reportId];
    if (!text || text.trim() === "") return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://civicone2-0.onrender.com/api/reports/${reportId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ text })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setCommentsData((prev) => ({ ...prev, [reportId]: data }));
        setCommentText((prev) => ({ ...prev, [reportId]: "" }));
      } else {
        alert(data.message || "Failed to comment");
      }
    } catch (err) {
      console.error(err);
      alert("Error posting comment");
    }
  };

  return (
    <div className="feed-container">

      {/* Header */}
      <div className="feed-header">
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <ArrowLeft />
        </Link>
        <h1>CivicOne Feed</h1>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading reports...</p>}

      {/* Feed List */}
      <div className="feed-list">
        {reports.map((report) => (
          <div key={report._id} className="feed-card">

            {/* User */}
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
              <img src={report.imagePath} alt="Issue" className="issue-image" />
            )}

            {/* Description */}
            <p className="description">{report.description}</p>

            {/* Status */}
            <p className="status">
              Status: <strong>{report.status}</strong>
            </p>

            {/* ================= COMMENTS ================= */}
            <div className="comments-section">

              {/* Show comments */}
              {(commentsData[report._id] || report.comments || []).map((c, i) => (
                <div key={i} className="comment">
                  <strong>{c.user?.name || "User"}:</strong> {c.text}
                </div>
              ))}

              {/* Add comment */}
              <div className="comment-input">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText[report._id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [report._id]: e.target.value
                    }))
                  }
                />
                <button onClick={() => handleAddComment(report._id)}>
                  Post
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
