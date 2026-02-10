import React, { useState } from "react";
import {
  ArrowLeft, Camera, MapPin, ChevronRight, CheckCircle,
  Route, Trash2, Droplet, Lightbulb, Building2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CameraCapture from "../parts/CameraCapture";
import "../stylesheets/ReportingPage.css";

const categoriesList = [
  "Road Issue",
  "Waste Management",
  "Water Supply",
  "Streetlights",
  "Public Property"
];

const ReportingPage = () => {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [showCategories, setShowCategories] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShowCamera = () => setShowCamera(true);
  const handleCloseCamera = () => setShowCamera(false);

  // Convert base64 → File
  const base64ToFile = (base64, filename) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  // Get location
  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setCoords({ lat: coords.latitude, lng: coords.longitude });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await response.json();
          setLocation(
            data.display_name || `${coords.latitude}, ${coords.longitude}`
          );
        } catch {
          setLocation(`${coords.latitude}, ${coords.longitude}`);
        }
        setLoadingLocation(false);
      },
      () => {
        alert("Allow location access");
        setLoadingLocation(false);
      }
    );
  };

  const handleRetake = () => {
    setCapturedImage(null);
    handleShowCamera();
  };

  // Submit report
  const handleSubmit = async () => {
    if (!category || !location || !capturedImage || !description.trim()) {
      return alert("Fill all fields, description & capture photo!");
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      const imageFile = base64ToFile(capturedImage, "report.jpg");

      const formData = new FormData();
      formData.append("title", category);
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("latitude", coords.lat || "0");
      formData.append("longitude", coords.lng || "0");
      formData.append("address", location);
      formData.append("image", imageFile);

      const res = await fetch("https://civicone2-0.onrender.com/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submit failed");

      setTrackingId(data._id);
      setSubmitted(true);

      // Reset form
      setDescription("");
      setCategory("");
      setLocation("");
      setCapturedImage(null);
      setShowCamera(false);

      // Navigate to success page
      navigate("/successpage");

    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit report");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="report-container">

      <div className="header">
        <button className="back-btn">
          <Link to="/"><ArrowLeft size={22} /></Link>
        </button>
        <h1>Report an Issue</h1>
      </div>

      {/* Image Capture */}
      <div className="upload-box">
        {!showCamera && !capturedImage && (
          <div
            className="upload-content"
            onClick={handleShowCamera}
            style={{ cursor: "pointer" }}
          >
            <Camera size={56} className="camera-icon" />
            <p>Upload Photo</p>
          </div>
        )}

        {showCamera && (
          <CameraCapture
            onCapture={(image) => {
              setCapturedImage(image);
              handleCloseCamera();
            }}
            onClose={handleCloseCamera}
          />
        )}

        {capturedImage && (
          <div className="captured-preview">
            <h4>Captured Photo:</h4>
            <img src={capturedImage} alt="Captured" />
            <button onClick={handleRetake} className="retake-btn">
              Retake
            </button>
          </div>
        )}
      </div>

      {/* Category */}
      <button
        className="option-btn"
        onClick={() => setShowCategories(!showCategories)}
      >
        <span>{category || "Select category"}</span>
        <ChevronRight size={18} />
      </button>

      {showCategories && (
        <div className="category-list">
          {categoriesList.map((cat, idx) => (
            <div
              key={idx}
              className={`category-option ${category === cat ? "active" : ""}`}
              onClick={() => {
                setCategory(cat);
                setShowCategories(false);
              }}
            >
              {cat === "Road Issue" && <Route size={18} />}
              {cat === "Waste Management" && <Trash2 size={18} />}
              {cat === "Water Supply" && <Droplet size={18} />}
              {cat === "Streetlights" && <Lightbulb size={18} />}
              {cat === "Public Property" && <Building2 size={18} />}
              <span>{cat}</span>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <textarea
        placeholder="Enter description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Location */}
      <button
        className="option-btn"
        onClick={handleGetLocation}
        disabled={loadingLocation}
      >
        <div className="option-left">
          <MapPin size={20} />
          <span>
            {loadingLocation ? "Fetching location..." : location || "Auto Location"}
          </span>
        </div>
        <ChevronRight size={18} />
      </button>

      {/* Submit */}
      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {/* Success */}
      {submitted && (
        <div className="submitted-box">
          <CheckCircle size={22} />
          <p>
            Report submitted <br />
            <span className="tracking">Tracking ID - {trackingId}</span>
          </p>
        </div>
      )}

    </div>
  );
};

export default ReportingPage;
