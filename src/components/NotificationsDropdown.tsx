// components/NotificationsDropdown.tsx
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { listenToNotifications } from "@/lib/queries/fetchNotifications";
import { Menu } from "@headlessui/react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: any;
}

export default function NotificationsDropdown({ nodeId }: { nodeId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!nodeId) return;

    const unsubscribe = listenToNotifications(nodeId, setNotifications);
    return () => unsubscribe();
  }, [nodeId]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="relative p-2">
        <Bell className="w-6 h-6 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-block h-2 w-2 bg-red-500 rounded-full" />
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
          ) : (
            notifications.map((notif) => (
              <Menu.Item key={notif.id}>
                {({ active }) => (
                  <div
                    className={`px-4 py-2 text-sm ${active ? "bg-gray-100" : ""}`}
                  >
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-gray-500">{notif.body}</p>
                  </div>
                )}
              </Menu.Item>
            ))
          )}
        </div>

        <div className="p-2 text-center">
          <Link href={`/notifications/${nodeId}`}>
            <span className="text-blue-500 text-sm hover:underline">
              See all notifications
            </span>
          </Link>
        </div>
      </Menu.Items>
    </Menu>
  );
}
