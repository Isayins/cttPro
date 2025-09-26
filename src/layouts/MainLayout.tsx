import type { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      {/* 
        pt-16: Tailwind 的 fallback（64px）
        style: 使用 calc 将 safe-area-inset-top 也包含进去（iPhone 刘海屏友好）
      */}
      <main
        className="flex-1 pt-1"
      >
        <div className="max-w-6xl mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}