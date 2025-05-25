import { useState } from "react";
import { Link } from "react-router-dom";
import ContactModal from "./modals/ContactModal"; 

export default function Footer() {
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <footer className="text-center text-xs text-slate-400 font-light lowercase py-10 space-y-3 tracking-wide25">
        <div className="space-x-6">
          <Link to="/about" className="hover:underline">
            about
          </Link>
          <button
            onClick={() => setShowContact(true)}
            className="hover:underline tracking-wide25"
          >
            contact
          </button>
        </div>
        <div className="-tracking-normal">
          <p>© 1992 Holidaze. All rights reserved.</p>
        </div>
      </footer>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}
