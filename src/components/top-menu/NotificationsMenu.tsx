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
import { toast } from "sonner";
import { markAsReadAll } from "@/actions/notifications/mark-as-read-all";

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

  const onMarkAllAsRead = async () => {
    const { ok, message } = await markAsReadAll();

    if (!ok) {
      toast.error(message);
    }
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
          className="flex items-center justify-between text-primary text-sm px-2"
        >
          <div className="flex items-center gap-2">
            <Bell />
            <span>Mis Notificaciones</span>
          </div>
          <button
            className="hover:underline cursor-pointer"
            onClick={onMarkAllAsRead}
          >
            Marcar como leídas
          </button>
        </div>
        <MenubarSeparator />
        {notifications.length === 0 ? (
          <div className="text-sm my-5 flex flex-col items-center text-gray-500">
            <MailX size={50} />
            <span>No tienes notificaciones</span>
          </div>
        ) : (
          <div className="max-w-80 max-h-72 overflow-y-auto">
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
