import { Link } from "react-router-dom";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isManager = user?.venueManager;

  return (
    <header className="flex justify-between items-center p-4 text-sm tracking-wide text-slate-500">
      <div className="space-x-4">
        <Link to="/">home</Link>
        <Link to="/escapes">search</Link>
        <Link
          to={
            user
              ? isManager
                ? "/account/manager"
                : "/account/customer"
              : "/auth"
          }
          className="underline cursor-pointer"
        >
          account
        </Link>
      </div>
    </header>
  );
}
