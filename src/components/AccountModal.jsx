export default function AccountModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl mb-4">Login or Register</h2>
        {/* Replace with your login/register UI */}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-blue-500 underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
