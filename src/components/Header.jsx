import { useState } from "react";
import { Link } from "react-router-dom";
import SearchPanel from "../components/SearchPanel"; // Adjust as needed

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isManager = user?.venueManager;

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 text-sm text-slate-500 font-light lowercase">
        {/* home + search */}
        <div className="flex gap-6">
          <Link to="/" className="hover:underline">
            home
          </Link>
          <button
            onClick={() => setShowSearch(true)}
            className="hover:underline"
          >
            search
          </button>
        </div>

        {/* account */}
        <div>
          <Link
            to={
              user
                ? isManager
                  ? "/account/manager"
                  : "/account/customer"
                : "/auth"
            }
            className="hover:underline"
          >
            account
          </Link>
        </div>
      </header>

      {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}
    </>
  );
}
