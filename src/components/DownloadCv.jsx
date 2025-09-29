function DownloadCV() {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/Cv.pdf"; // path file داخل public
        link.download = "MyCV.pdf";
        link.click();
    };

    return (
        <button onClick={handleDownload} className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:scale-105 transition-transform">
            Download CV
        </button>
    );
}

export default DownloadCV;
