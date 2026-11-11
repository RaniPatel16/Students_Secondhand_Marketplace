import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "CampusMart | Student Second-Hand Marketplace",
  description: "Buy Smart. Sell Easy. Reuse More. The official campus marketplace for university students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-brand-canvas text-brand-textMain">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#4A1525",
              color: "#FFFFFF",
              borderRadius: "10px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#E0876A",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
