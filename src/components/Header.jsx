import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 text-sm tracking-wide text-slate-500">
      <div className="space-x-4">
        <Link to="/">home</Link>
        <Link to="/escapes">escapes</Link>
        <Link to="/auth" className="underline cursor-pointer">
          account
        </Link>
      </div>
    </header>
  );
}
