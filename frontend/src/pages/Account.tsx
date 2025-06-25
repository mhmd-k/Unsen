import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { BadgeCheckIcon, Heart, LayoutDashboard, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Account = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="container px-4 mx-auto py-8">
      <h1 className="text-3xl my-4">Account Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Username
            </p>
            <p className="text-lg">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p className="text-lg">{user?.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Account Status
            </p>
            <p className="text-lg">
              {user?.isVerified ? (
                <Badge
                  variant="secondary"
                  className="bg-green-500 text-white text-sm rounded-full"
                >
                  <BadgeCheckIcon />
                  Verified
                </Badge>
              ) : (
                <Badge variant="destructive">Not Verified</Badge>
              )}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/wishlist")}
          className="flex items-center gap-2 border-pink-500 text-pink-500"
        >
          <Heart /> Wishlist
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center gap-2 border-black-btn text-black-btn"
        >
          <Lock /> Change Password
        </Button>
        {user?.role === "SELLER" && (
          <Button
            variant="outline"
            onClick={() => navigate("/seller-dashboard")}
            className="flex items-center gap-2 border-main text-main"
          >
            <LayoutDashboard /> Dashboard
          </Button>
        )}
      </div>

      <ChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Account;
