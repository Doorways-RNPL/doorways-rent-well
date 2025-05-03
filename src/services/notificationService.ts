import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export type NotificationType = 'application' | 'payment' | 'offer' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: 'unread' | 'read';
  created_at: string;
  read_at: string | null;
  metadata: Json | null;
}

export class NotificationService {
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    metadata?: Json
  ): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        status: 'read',
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) throw error;
  }

  static async getUserNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'unread');

    if (error) throw error;
    return count || 0;
  }
} 