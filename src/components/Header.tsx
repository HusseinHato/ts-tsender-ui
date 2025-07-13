// components/Header.jsx
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      {/* Left section - Logo and GitHub */}
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold">AirdropERC20</div>
        <a 
          href="https://github.com/your-repo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-2xl hover:text-gray-600 transition-colors"
        >
          <FaGithub />
        </a>
      </div>
      
      {/* Right section - Connect button */}
      <ConnectButton />
    </header>
  );
};
