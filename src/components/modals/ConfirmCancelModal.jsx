import { NOROFF_API_BASE_URL, NOROFF_API_KEY } from "../../config";

// src/components/modals/ConfirmCancelModal.jsx
export default function ConfirmCancelModal({
  type,
  target,
  onClose,
  onConfirm,
}) {
  const handleConfirm = async () => {
    const endpoint =
      type === "venue"
        ? `${NOROFF_API_BASE_URL}/holidaze/venues/${target.id}`
        : `${NOROFF_API_BASE_URL}/holidaze/bookings/${target.id}`;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": NOROFF_API_KEY,
        },
      });
      if (!res.ok) throw new Error("Failed to cancel");
      onConfirm?.();
      onClose();
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#fefefe]/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#fefefe]/90 backdrop-blur-md p-6 w-full max-w-sm text-[#7A92A7] text-sm lowercase text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl hover:underline"
        >
          &times;
        </button>
        <p className="mb-6">are you sure you want to cancel this {type}?</p>
        <div className="flex justify-center gap-10">
          <button onClick={onClose} className="hover:underline text-xs">
            no
          </button>
          <button onClick={handleConfirm} className="hover:underline text-xs">
            yes
          </button>
        </div>
      </div>
    </div>
  );
}
