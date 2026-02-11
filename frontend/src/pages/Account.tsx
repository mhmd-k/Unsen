import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import {
  BadgeCheckIcon,
  Heart,
  LayoutDashboard,
  Lock,
  PackageSearch,
} from "lucide-react";
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

      <div className="flex flex-wrap gap-3">
        {user?.role === "CUSTOMER" && (
          <Button
            variant="outline"
            onClick={() => navigate("/wishlist")}
            className="flex-1 md:max-w-[200px] flex items-center gap-2 border-pink-500 text-pink-500"
            size="lg"
          >
            <Heart className="size-5" /> Wishlist
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => setShowPasswordModal(true)}
          className="flex-1 md:max-w-[200px] flex items-center gap-2 border-black-btn text-black-btn"
          size="lg"
        >
          <Lock className="size-5" /> Change Password
        </Button>
        {user?.role === "SELLER" && (
          <Button
            variant="outline"
            onClick={() => navigate("/seller-dashboard")}
            className="flex-1 md:max-w-[200px] flex items-center gap-2 border-main text-main"
            size="lg"
          >
            <LayoutDashboard className="size-5" /> Dashboard
          </Button>
        )}
        {user?.role === "CUSTOMER" && (
          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
            className="flex-1 md:max-w-[200px] flex items-center gap-2 border-main text-main"
            size="lg"
          >
            <PackageSearch className="size-5" /> Your Orders
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
