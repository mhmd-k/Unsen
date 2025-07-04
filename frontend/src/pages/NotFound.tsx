import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

function NotFound() {
  return (
    <div className="container h-[60vh] flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold mb-4">404 - Page Not Found</h2>
      <Button asChild variant="outline">
        <Link to="/" className="main-btn">
          Return To Home Page
        </Link>
      </Button>
    </div>
  );
}

export default NotFound;
