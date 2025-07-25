"use client";

import { Bell, Mail, MailOpen, MailX, Trash } from "lucide-react";
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
import { CustomTooltip } from "../ui/CustomTooltip";
import { deleteNotification } from "@/actions/notifications/delete-notification";
import { deleteNotifications } from "@/actions/notifications/delete-notifications";
import { submitAlert } from "@/utils/submitAlert";

interface Props {
  notifications: Notification[];
  userSessionId: string;
}

export const NotificationsMenu = ({ notifications, userSessionId }: Props) => {
  const router = useRouter();

  const someNotificationsUnread = notifications.some(
    (notification) => !notification.read
  );

  const clickOnNotification = async (
    id: string,
    userId: string,
    to: string,
    isProduction: boolean
  ) => {
    router.push(
      to === "admin" || !isProduction
        ? "/dashboard/leader/orders"
        : "/dashboard/productor/orders"
    );
    const res = await readNotification(id, userId);

    if (!res.ok) {
      console.error(res.message);
    }

    router.refresh();
  };

  const onMarkAllAsRead = async () => {
    const { ok, message } = await markAsReadAll(userSessionId);

    if (!ok) {
      toast.error(message);
    }
  };

  const onDeleteNotification = async (id: string) => {
    const res = await deleteNotification(id);
    if (!res.ok) {
      toast.error(res.message);
    }
  };

  const onDeleteNotifications = async (userId: string) => {
    const result = await submitAlert({
      title: "Eliminar todas las notificaciones",
      text: "¿Estás seguro de que deseas eliminar todas las notificaciones?",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      icon: "warning",
    });

    if (result.isDenied || result.isDismissed)
      return toast.info("Operación cancelada");

    const res = await deleteNotifications(userId);
    if (!res.ok) {
      toast.error(res.message);
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
          className="flex items-center justify-between gap-5 text-primary text-sm px-2"
        >
          <div className="flex items-center gap-2">
            <Bell />
            <span>Mis Notificaciones</span>
          </div>
          <button
            className="hover:underline cursor-pointer"
            onClick={() => onMarkAllAsRead()}
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
              <div
                className="relative p-2 hover:bg-gray-100"
                key={notification.id}
              >
                <MenubarItem
                  className={`text-black ${
                    notification.read ? "" : "font-extrabold"
                  }`}
                >
                  <button
                    onClick={() =>
                      clickOnNotification(
                        notification.id,
                        notification.userId,
                        notification.to as string,
                        notification.message.includes("producción") ||
                          notification.message
                            .toLocaleLowerCase()
                            .includes("bodega")
                      )
                    }
                    className="text-left cursor-pointer flex items-center gap-2"
                  >
                    {notification.read ? <MailOpen /> : <Mail />}
                    {notification.message}
                  </button>
                </MenubarItem>
                {notification.read && (
                  <CustomTooltip text="Eliminar Notificación">
                    <button
                      className="text-red-500 hover:text-red-700 absolute top-1 right-1 cursor-pointer"
                      onClick={() => onDeleteNotification(notification.id)}
                    >
                      <Trash size={17} />
                    </button>
                  </CustomTooltip>
                )}
              </div>
            ))}
          </div>
        )}
        <MenubarSeparator />
        {notifications.length > 1 && (
          <button
            className="text-red-500 hover:text-red-700 text-xs hover:underline cursor-pointer text-center w-full"
            onClick={() => onDeleteNotifications(userSessionId)}
          >
            Eliminar todas las notificaciones
          </button>
        )}
      </MenubarContent>
    </MenubarMenu>
  );
};
