import React, { useEffect, useState } from "react";
import "../stylesheets/NotificationPage.css"
import { Bell, CheckCircle, AlertCircle, Clock, ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("https://civicone2-0.onrender.com/api/reports");
        const data = await res.json();

        const reports = data.reports || [];

        const notes = reports.map((report) => {
          let icon = <Clock size={20} />;
          let message = "Your issue is pending :";
          let statusClass = "pending";

          if (report.status === "IN_PROGRESS") {
            icon = <AlertCircle size={20} />;
            message = "Your issue is in progress";
            statusClass = "progress";
          }

          if (report.status === "RESOLVED") {
            icon = <CheckCircle size={20} />;
            message = "Your issue has been resolved";
            statusClass = "resolved";
          }

          return {
            id: report._id,
            message,
            location: report.location?.address || "Unknown location",
            time: new Date(report.updatedAt).toLocaleString(),
            icon,
            status: report.status,
            statusClass
          };
        });

        setNotifications(notes);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }

      setLoading(false);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-container">

      {/* Header */}
      <div className="notification-header">
        <Link to="/" className="back-btn">
          <ArrowLeft />
        </Link>
        <Bell size={24} />
        <h1>Notifications</h1>
      </div>

      {/* Loading */}
      {loading && <p className="loading">Loading notifications...</p>}

      {/* Empty */}
      {!loading && notifications.length === 0 && (
        <p className="no-data">No notifications yet</p>
      )}

      {/* Notification List */}
      <div className="notification-list">
        {notifications.map((note) => (
          <div key={note.id} className="notification-card">

            <div className="icon">{note.icon}</div>

            <div className="content">
              <p className="message">{note.message}</p>

              <div className="meta">
                <span className="location">
                  <MapPin size={13} /> {note.location}
                </span>
                <span className="time">{note.time}</span>
              </div>
            </div>

            <span className={`status-badge ${note.statusClass}`}>
              {note.status}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
};

export default NotificationPage;
