
export function ShareModal({ onClose }: { onClose: () => void }) {
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Copied!");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-xl shadow-lg p-6 relative">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Share this page
        </h2>

        <div className="flex items-center border rounded-lg p-2 mb-4">
          <input
            type="text"
            value={currentUrl}
            readOnly
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200"
          />
          <button
            onClick={copyToClipboard}
            className="ml-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-md text-sm"
          >
            Copy
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
