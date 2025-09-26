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
      <RouterConfig /> {/* 路由出口 */}
    </div>
  );
}
