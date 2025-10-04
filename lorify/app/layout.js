import "./globals.css";

export const metadata = {
  title: "AI Character Demo",
  description: "Hackathon project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
