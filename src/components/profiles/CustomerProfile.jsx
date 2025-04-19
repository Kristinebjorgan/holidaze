import { useEffect, useState } from "react";

function CustomerProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-2">hallo, {user.name}</h1>
      <p className="text-sm text-gray-600">Email: {user.email}</p>
    </div>
  );
}

export default CustomerProfile;
