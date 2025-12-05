import React from "react";

function Hero() {
  return (
    <div className="hero">
      <header style={{ paddingLeft: 0 }}>
        <div
          className="p-5 text-center bg-image"
          style={{
            backgroundImage:
              "url('https://mdbootstrap.com/img/new/slides/041.webp')",
            height: 400,
            // 💡 FIX 1: Prevent image from repeating and ensure it covers the container
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            position: "relative", // 💡 REQUIRED: Make this the positioning context for the overlay
          }}>
          <div
            className="overlay"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              // 💡 FIX 2: Ensure the overlay covers 100% of the parent (.bg-image)
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 1, // Ensure overlay is above content if needed
            }}>
            <div
              className="d-flex justify-content-center align-items-center h-100"
              style={{ zIndex: 2, position: "relative" }}>
              {/* Ensure text is above the overlay (optional, depends on Bootstrap) */}
              <div className="text-white">
                <h1 className="mb-3">Clean Energy</h1>
                <h4 className="mb-3">Powering cleaner future.</h4>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Hero;
