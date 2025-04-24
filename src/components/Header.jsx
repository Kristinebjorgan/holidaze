import { useState } from "react";
import { Link } from "react-router-dom";
import SearchPanel from "../components/SearchPanel"; // adjust path as needed

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isManager = user?.venueManager;

  return (
    <>
      <header className="flex justify-between items-center p-4 text-sm tracking-wide text-slate-500">
        <div className="space-x-4">
          <Link to="/">home</Link>
          <button
            onClick={() => setShowSearch(true)}
            className="hover:underline"
          >
            search
          </button>
          <Link
            to={
              user
                ? isManager
                  ? "/account/manager"
                  : "/account/customer"
                : "/auth"
            }
            className="underline"
          >
            account
          </Link>
        </div>
      </header>

      {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}
    </>
  );
}
