import { NotificationItem } from '../types';

type NotificationListener = (item: NotificationItem) => void;

class NotificationManager {
  private listeners: NotificationListener[] = [];
  private notifications: NotificationItem[] = [];

  subscribe(listener: NotificationListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(item: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>): NotificationItem {
    const fullItem: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    this.notifications.unshift(fullItem);
    this.listeners.forEach((l) => l(fullItem));
    return fullItem;
  }

  getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  markAsRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
    }
  }

  clearAll() {
    this.notifications = [];
  }
}

export const NotificationService = new NotificationManager();
