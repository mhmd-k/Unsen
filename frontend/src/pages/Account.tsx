import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { BsLockFill, BsSuitHeart } from "react-icons/bs";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const Account = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Username
                </p>
                <p className="text-lg">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-lg">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Role
                </p>
                <p className="text-lg">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Account Status
                </p>
                <p className="text-lg">
                  {user?.isVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/wishlist")}
              className="flex items-center gap-2"
            >
              <BsSuitHeart /> Wishlist
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2"
            >
              <BsLockFill /> Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Account;
