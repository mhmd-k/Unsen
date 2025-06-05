import { Container, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { BsLockFill, BsSuitHeart } from "react-icons/bs";

const Account = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <Container className="py-4">
      <h1 className="mb-0">Account Information</h1>
      <hr />
      <div className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Username:</strong> {user?.username}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Role:</strong> {user?.role}
            </p>
            <p>
              <strong>Account Status:</strong>{" "}
              {user?.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex gap-3">
        <Button
          className="wishlist-account-btn"
          onClick={() => navigate("/wishlist")}
        >
          <BsSuitHeart /> Wishlist
        </Button>
        <Button
          className="change-pass-account-btn"
          onClick={() => setShowPasswordModal(true)}
        >
          <BsLockFill /> Change Password
        </Button>
      </div>

      <ChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      />
    </Container>
  );
};

export default Account;
