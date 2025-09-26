import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Image, Drawer, Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import logo from "../store/images/idncar.png";

const pageTitle = [
  { title: "I dn Car", href: "/" },
  { title: "关于", href: "/about" },
  { title: "下载中心", href: "/downloads" },
  { title: "实用工具", href: "/tools" },
];

export default function Header() {
  const location = useLocation();
  const currentPage = pageTitle.find((item) => location.pathname === item.href);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="w-full bg-white/90 backdrop-blur-md shadow-sm fixed top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* 左边 Logo + 标题 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden transition-transform duration-300 hover:rotate-6 shadow">
            <Image src={logo} width={40} height={40} preview={false} className="rounded-xl" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent truncate max-w-[120px] sm:max-w-[200px]">
            {currentPage?.title || "页面"}
          </h1>
        </div>

        {/* 大屏导航 */}
        <nav className="hidden md:flex gap-6">
          {pageTitle.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`relative px-1 text-sm sm:text-base transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.title}
                {isActive && (
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 rounded"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 移动端汉堡按钮 */}
        <Button
          className="md:hidden"
          type="text"
          icon={drawerOpen ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setDrawerOpen((prev) => !prev)}
        />

        {/* 移动端 Drawer */}
        <Drawer
          title="菜单"
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          bodyStyle={{ padding: 0 }}
        >
          <nav className="flex flex-col p-4 gap-4">
            {pageTitle.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-2 py-2 text-base rounded ${
                  location.pathname === item.href
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setDrawerOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </Drawer>
      </div>
    </header>
  );
}
