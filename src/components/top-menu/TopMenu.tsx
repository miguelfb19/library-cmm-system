import { User } from "lucide-react";
import { Logout } from "./Logout";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import Link from "next/link";
import { HamburgerOpenMenu } from "./HamburgerOpenMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { getNotifications } from "@/actions/notifications/get-notifications";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export const TopMenu = async () => {
  
  const session = await auth()
  const { ok, message, data } = await getNotifications();

  // If the user is not authenticated, redirect to login
  if(!session?.user) redirect("/auth/login");

  // If there are no notifications or an error occurred, show a message
  if (!ok || !data) {
    return <div>{message || "Error al cargar las notificaciones"}</div>;
  }

  const filteredNotifications = data.filter((notification) => notification.userId === session.user.id);

  return (
    <nav className="w-full bg-primary/90 shadow-lg h-16 text-white flex items-center px-5">
      <HamburgerOpenMenu />
      <div className="flex flex-1 items-center justify-end gap-5">
        <Menubar>
          {/* USUARIO */}

          <MenubarMenu>
            <MenubarTrigger>
              <User />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <Link
                  href="/dashboard/my-account"
                  className="flex items-center gap-2"
                >
                  <User className="text-primary" />
                  Mi Cuenta
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">
                <Logout />
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* NOTIFICACIONES */}
          <NotificationsMenu notifications={filteredNotifications || []} userSessionId={session.user.id} />
        </Menubar>
      </div>
    </nav>
  );
};
