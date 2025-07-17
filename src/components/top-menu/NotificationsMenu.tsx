"use client";

import { Bell, Mail, MailOpen, MailX } from "lucide-react";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import { Notification } from "@/interfaces/Notification";
import { readNotification } from "@/actions/notifications/read-notification";
import { useRouter } from "next/navigation";

interface Props {
  notifications: Notification[];
}

export const NotificationsMenu = ({ notifications }: Props) => {
  const router = useRouter();

  const someNotificationsUnread = notifications.some(
    (notification) => !notification.read
  );

  const clickOnNotification = async (id: string, to: string) => {
    router.push(
      to === "admin"
        ? "/dashboard/leader/orders"
        : "/dashboard/productor/production"
    );
    const res = await readNotification(id);

    if (!res.ok) {
      console.error(res.message);
    }

    router.refresh();
  };

  return (
    <MenubarMenu>
      <MenubarTrigger>
        <div className="relative">
          <Bell />
          {someNotificationsUnread && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </div>
      </MenubarTrigger>
      <MenubarContent>
        <div
          id="title"
          className="flex items-center gap-2 text-primary text-sm"
        >
          <Bell />
          Mis Notificaciones
        </div>
        <MenubarSeparator />
        {notifications.length === 0 ? (
          <div className="text-sm my-5 flex flex-col items-center text-gray-500">
            <MailX size={50}/>
            <span>No tienes notificaciones</span>
          </div>
        ) : (
          <div className="max-w-60">
            {notifications.map((notification) => (
              <MenubarItem
                key={notification.id}
                className={`text-black ${
                  notification.read ? "" : "font-extrabold"
                }`}
              >
                <button
                  onClick={() =>
                    clickOnNotification(
                      notification.id,
                      notification.to as string
                    )
                  }
                  className="text-left cursor-pointer flex items-center gap-2"
                >
                  {notification.read ? <MailOpen /> : <Mail />}
                  {notification.message}
                </button>
              </MenubarItem>
            ))}
          </div>
        )}
      </MenubarContent>
    </MenubarMenu>
  );
};
