import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container h-[60vh] flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold mb-4">404 - Page Not Found</h2>
      <Link to="/" className="cart-link" replace>
        Return To Home Page
      </Link>
    </div>
  );
}

export default NotFound;
