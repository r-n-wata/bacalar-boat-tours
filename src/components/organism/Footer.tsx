import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-4 text-center">
      <p>&copy; {new Date().getFullYear()} Bacalar Boat Tours</p>
      <p className="mt-2">
        Email: info@bacalarboats.com | WhatsApp: +52 1 999 123 4567
      </p>
    </footer>
  );
}

export default Footer;
