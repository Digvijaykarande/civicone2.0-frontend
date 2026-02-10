import "../stylesheets/SuccessPage.css";
import { Link } from "react-router-dom";
const SuccessPage = () => {
  return (
    <div className="success-wrapper">
      {/* Animated Circle */}
      <div className="success-circle">
        <div className="checkmark">✓</div>
      </div>

      {/* Text */}
      <h1 className="success-title">Complaint Submitted Successfully</h1>
      <p className="success-text">
        Thank you for Report. Our team will look into it shortly.
      </p>

      {/* Buttons */}
      <Link to="/notifications">
      <button className="btn primary-btn">
        🔍 Track Complaint
      </button></Link>

      <Link to='/'><button className="btn secondary-btn">
        🏠 Back to Home
      </button></Link>
    </div>
  );
};

export default SuccessPage;
