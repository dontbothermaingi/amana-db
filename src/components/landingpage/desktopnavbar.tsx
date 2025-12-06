import { Calendar, Gift, Key, ShoppingBag, ToolCase } from "lucide-react";
import React, { useState } from "react";
import { FaSnapchatGhost } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/* ICON ASSETS                                */
/* -------------------------------------------------------------------------- */

const NavIcons: any = {
  Home: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  "For Sale": <ShoppingBag size={25} />,
  "For Rent": <Key size={25} />,
  OffPlan: <Calendar size={25} />,
  "About Our Team": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  "Connect & Earn": <Gift size={25} />,
  Renovations: <ToolCase size={25} />,
  "Contact Us": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.03 12.03 0 0 0 2.81.57A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

const SocialIcons: any = {
  LinkedIn: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Instagram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Facebook: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  YouTube: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  X: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  ),
  TikTok: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
  Snapchat: <FaSnapchatGhost />,
};

interface MenuItem {
  label: string;
  link: string;
  ariaLabel: string;
}

interface SocialItem {
  label: string;
  link: string;
}

interface SidebarProps {
  items: MenuItem[];
  socialItems: SocialItem[];
}

export const MobileTopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-[#0B253F] border-b border-[#BA7F55]/20 flex items-center justify-between px-4 z-50 shadow-md">
      {/* Left: Hamburger */}
      <button
        onClick={onMenuClick}
        className="text-white hover:text-[#BA7F55] p-2 transition-colors"
        aria-label="Open Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Center: Logo */}
      <div className="bg-white p-1 rounded-full h-10 w-10 flex items-center justify-center">
        <img
          src="/amana.svg"
          alt="Amana Homes"
          className="h-8 w-8 object-contain"
        />
      </div>

      {/* Right: Spacer */}
      <div className="w-10" />
    </div>
  );
};

const DesktopSidebar: React.FC<SidebarProps> = ({ items, socialItems }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      style={{ fontFamily: "IT Medium" }}
      className={`flex flex-col h-full bg-[#0B253F] border-r border-[#BA7F55]/20 transition-all duration-300 ease-in-out relative z-40 shadow-xl
      ${isExpanded ? "w-[240px]" : "w-[75px]"}`}
    >
      {/* --- HEADER SECTION --- */}
      <div
        className={`flex items-center p-3 mb-4 ${
          isExpanded ? "justify-between" : "justify-center flex-col gap-4"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:text-[#BA7F55] transition-colors p-1"
          aria-label="Toggle Menu"
        >
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-[#BA7F55] transition-colors p-1"
          title="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* --- LOGO --- */}
      <div
        className={`flex items-center justify-center mb-6 transition-all duration-300 ${
          isExpanded ? "px-4" : "px-1"
        }`}
      >
        <div
          className={`bg-white rounded-full flex items-center justify-center shadow-md ${
            isExpanded ? "h-20 w-20 p-2" : "h-10 w-10 p-1"
          }`}
        >
          <img
            src="/amana.svg"
            alt="Amana Homes"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* --- NAVIGATION ITEMS --- */}
      <div className="flex flex-col w-full flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {items.map((item, index) => {
          const isActive = location.pathname === item.link;

          return (
            <Link
              key={index}
              to={item.link}
              aria-label={item.ariaLabel}
              className={`relative flex items-center h-12 transition-all duration-200 group
                ${isExpanded ? "px-6 justify-start" : "justify-center px-0"}
                ${
                  isActive
                    ? "text-[#BA7F55] bg-white/5" // Active: Bronze text + subtle background
                    : "text-white/80 hover:bg-white/5 hover:text-white" // Inactive: White-ish + Hover
                }
              `}
            >
              {/* Active Sidebar Line */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#BA7F55]" />
              )}

              <div className="flex-shrink-0">
                {NavIcons[item.label] || NavIcons["Home"]}
              </div>

              <span
                className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded ? "opacity-100 visible" : "opacity-0 invisible w-0"
                }`}
              >
                {item.label}
              </span>

              {/* Tooltip (Collapsed) */}
              {!isExpanded && (
                <div className="absolute left-16 bg-[#0B253F] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[60] border border-[#BA7F55]/30 shadow-lg pointer-events-none">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* --- FOOTER / SOCIALS --- */}
      {/* Only show when expanded to keep collapsed view clean */}
      {isExpanded && (
        <div className="mt-auto border-t border-[#BA7F55]/20 p-4">
          <div className="mb-2 text-md font-semibold tracking-wider text-[#BA7F55]">
            Connect with us
          </div>
          <div className="grid grid-cols-4 gap-3 place-items-center">
            {socialItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                title={item.label}
                className="text-white hover:text-[#BA7F55] transition-colors p-1"
              >
                {SocialIcons[item.label] || SocialIcons.Facebook}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopSidebar;
