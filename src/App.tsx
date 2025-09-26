import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css';

// src/App.tsx
import { Link } from "react-router-dom";
import RouterConfig from "./router";

export default function App() {
  return (
    <div className="p-4">
      <nav className="space-x-4">
        <Link to="/" className="text-blue-500">首页</Link>
        <Link to="/about" className="text-blue-500">关于</Link>
      </nav>

      <RouterConfig /> {/* 路由出口 */}
    </div>
  );
}
