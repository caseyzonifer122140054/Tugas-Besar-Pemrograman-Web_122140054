import api from "@/utils/api";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([

  ]);

  useEffect(() => {
    const fetchNotifications = async () => {
      api.get("/api/notifications")
        .then((response) => {
          const notifications = response.data;
          setNotifications(notifications);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }

    fetchNotifications();
  }, []);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );

    api.post("/api/notifications/" + id + "/read")
      .then((response) => {
        api.get("/api/notifications")
          .then((response) => {
            const notifications = response.data;
            setNotifications(notifications);

            toast.success("Notifikasi berhasil ditandai sebagai dibaca");
          })
          .catch((error) => {
            console.error("Error fetching notifications:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  if (notifications.length === 0) return <p>Tidak ada notifikasi.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifikasi</h1>
      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`p-4 rounded border cursor-pointer ${notif.read ? "bg-gray-100" : "bg-white font-semibold"
              }`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className="flex justify-between items-center">
              <span>{notif.title}</span>
              <small className="text-gray-500 text-xs">{new Date(notif.createdAt).toLocaleString()}</small>
            </div>
            <p className="mt-2">{notif.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
