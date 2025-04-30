export default function ContactModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[400px] bg-white/80 backdrop-blur-md p-6 text-[#7A92A7] text-sm lowercase tracking-wide rounded-none">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-4 text-xl text-[#7A92A7] hover:underline"
        >
          &times;
        </button>
        <p>for inquiries, contact us at:</p>
        <a
          href="mailto:support@holidaze.com"
          className="underline block mt-2 hover:opacity-80"
        >
          support@holidaze.com
        </a>
      </div>
    </div>
  );
}
