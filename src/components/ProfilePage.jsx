import React, { useEffect, useState } from "react";
import "../stylesheets/ProfilePage.css";
import { Edit2, Settings, LogOut, MapPin, FileText, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Generate short civic UID from Mongo _id
  const generateCivicUID = (mongoId) => {
    if (!mongoId) return "CIVIC0000";
    const num = parseInt(mongoId.slice(-6), 16) % 10000;
    return ` CIVIC${num.toString().padStart(4, "0")}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("https://civicone2-0.onrender.com/api/users/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          alert(data.message);
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user data");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!user) return null;

  return (
    <div className="profile-page-main">
      <div className="profile-page">

        {/* Header */}
        <div className="profile-header-bg">
          <div className="profile-header">

            <span>
              <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                <ArrowLeft />
              </Link>
            </span>

            <img
              src="https://img.icons8.com/?size=100&id=kDoeg22e5jUY&format=png&color=000000"
              alt="Profile"
              className="profile-pic"
            />

            <div className="profile-name-uid">
              <h2>{user.name}</h2>
              <p>UID  : <b>{generateCivicUID(user._id)}</b></p>
            </div>

            <button className="edit-btn">
              <Edit2 size={18} /> Edit
            </button>

          </div>
        </div>

        {/* Stats */}
        <div className="stats-cards">
          <div className="card">
            <FileText size={24} />
            <div>
              <p>{user.reports || 0}</p>
              <span>Total Reports</span>
            </div>
          </div>

          <div className="card">
            <MapPin size={24} />
            <div>
              <p>{user.pendingReports || 0}</p>
              <span>Pending</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="profile-info">
          <div className="info-item"><strong>Email:</strong> {user.email}</div>
          <div className="info-item"><strong>Phone:</strong> {user.phone || "N/A"}</div>
          <div className="info-item"><strong>Location:</strong> {user.location || "N/A"}</div>
        </div>

        {/* Recent Reports (optional future dynamic) */}
        <div className="recent-activities">
          <h3>Recent Reports</h3>
        </div>

        {/* Actions */}
        <div className="action-buttons">

          <button className="settings-btn">
            <Settings size={18} /> Settings
          </button>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            <LogOut size={18} /> Logout
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
