import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { NotificationService } from "@/services/notificationService";
import { Notification } from "@/services/notificationService";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) return;

        const [notifications, count] = await Promise.all([
          NotificationService.getUserNotifications(userId),
          NotificationService.getUnreadCount(userId)
        ]);

        setNotifications(notifications);
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, async () => {
        await fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === 'unread') {
      try {
        await NotificationService.markAsRead(notification.id);
        setNotifications(prev => prev.map(n => 
          n.id === notification.id ? { ...n, status: 'read' } : n
        ));
        setUnreadCount(prev => prev - 1);
      } catch (error) {
        console.error("Error marking notification as read:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to mark notification as read"
        });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-muted-foreground">
            No notifications
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start gap-1 p-3 ${
                notification.status === 'unread' ? 'bg-muted' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="font-medium">{notification.title}</div>
              <div className="text-sm text-muted-foreground">
                {notification.message}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(notification.created_at).toLocaleString()}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 