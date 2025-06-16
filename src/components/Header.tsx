"use client";

import {
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { app } from "@/lib/firebase";
import { useNotifications } from "@/hooks/useNotifications";
import { getTierLevelIcon } from "./getTierIcon";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const notifications = useNotifications()
    .filter((d) => d.isRead === false)
    .sort((a, b) => {
      const timeA = a.timestamp?.toDate().getTime() || 0;
      const timeB = b.timestamp?.toDate().getTime() || 0;
      return timeB - timeA;
    });
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push("/");
  };
  const handleToNotifications = () => {
    setDropdownOpen(false);
    router.replace("/notifications");
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 relative z-50">
      <div className="text-xl font-semibold text-gray-800">
        Noise Monitoring
      </div>
      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Notifications"
            className="relative rounded"
          >
            <BellIcon className="w-6 h-6 text-gray-600 hover:text-indigo-600 transition" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 scrollbar-hide">
              <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-gray-900 font-semibold text-lg">
                  Notifications
                </h3>
                <button
                  onClick={() => setDropdownOpen(false)}
                  aria-label="Close notifications"
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  &times;
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm select-none">
                  No unread notifications
                </div>
              ) : (
                <ul>
                  {notifications.map((notif) => {
                    const tier = getTierLevelIcon(notif.soundLevel);
                    return (
                      <li
                        key={notif.id}
                        className="flex flex-col px-4 py-3 cursor-pointer hover:bg-gray-50 transition rounded-lg m-2 border border-transparent hover:border-indigo-300"
                        title={notif.title}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`${tier.iconColor} flex-shrink-0`}>
                            {tier.icon}
                          </span>
                          <p className="font-semibold text-gray-800 truncate">
                            {notif.title}
                          </p>
                          {notif.timestamp && (
                            <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                              {new Date(
                                notif.timestamp.toDate()
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-gray-400 line-clamp-2 text-sm">
                          {notif.message}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
              <button
                onClick={handleToNotifications}
                className="p-8 text-gray-600 w-full hover:bg-gray-100 hover:font-boldx"
              >
                See all notifications
              </button>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold select-none">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-gray-800 font-medium truncate max-w-xs select-text">
            {user?.displayName || user?.email || "Guest"}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          title="Logout"
          aria-label="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
