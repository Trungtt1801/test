// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/app/context/authContext";
export const metadata = {
  title: "Trang web của bạn",
  description: "Mô tả ngắn gọn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* Thêm font và icon nếu muốn dùng toàn cục */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
