// components/ContactModal.js
import { useEffect } from "react";

export default function ContactModal({ isOpen, onClose, status }) {
  // console.log(status);
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80">
      {/* Backdrop */}
      {/* <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div> */}

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all max-w-sm w-full p-6 md:max-w-md relative">
          <div>
            {/* Icon */}
            <div
              className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                isSuccess ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {isSuccess ? (
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="mt-3 text-center sm:mt-5">
              <h3
                className={`text-lg leading-6 font-medium ${
                  isSuccess ? "text-gray-900" : "text-red-900"
                }`}
              >
                {isSuccess
                  ? "Message Sent Successfully!"
                  : "Error Sending Message"}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {isSuccess
                    ? "Thank you for contacting us! We'll get back to you as soon as possible."
                    : "There was a problem sending your message. Please try again or contact us directly."}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className={`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition duration-200 ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              }`}
              onClick={onClose}
            >
              {isSuccess ? "Great!" : "Try Again"}
            </button>
          </div>

          {/* Close button */}
          <button
            type="button"
            className="absolute top-0 right-0 m-4 text-gray-400 hover:text-gray-600 transition duration-200"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
