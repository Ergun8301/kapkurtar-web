import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import { useClientNotifications } from "../hooks/useClientNotifications";
import { supabase } from "../lib/supabaseClient";
import { ReservationDetailsModal } from "./ReservationDetailsModal";

interface Notification {
  id: string;
  recipient_id: string;
  message: string;
  title?: string;
  type?: "offer" | "offer_nearby" | "reservation" | "system" | "offer_expired" | "stock_empty";
  data?: any;
  is_read: boolean;
  created_at: string;
}

interface NotificationBellProps {
  userType?: "merchant" | "client";
}

export function NotificationBell({ userType }: NotificationBellProps) {
  if (!userType || (userType !== "merchant" && userType !== "client")) return null;

  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    notifications: realtimeNotifs,
    unreadCount: hookUnreadCount,
    markAsRead: hookMarkAsRead,
    markAllAsRead: hookMarkAllAsRead,
  } =
    userType === "client"
      ? useClientNotifications()
      : useRealtimeNotifications();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const shakeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (realtimeNotifs.length > 0) {
      setNotifications(realtimeNotifs);
      setUnreadCount(hookUnreadCount);
    }
  }, [realtimeNotifs, hookUnreadCount]);

  useEffect(() => {
    if (unreadCount > 0 && !open) {
      shakeIntervalRef.current = setInterval(() => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }, 4000);
    } else {
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current);
        shakeIntervalRef.current = null;
      }
    }

    return () => {
      if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current);
    };
  }, [unreadCount, open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    if (userType === "client") {
      if (
        (notification.type === "offer" || notification.type === "offer_nearby") &&
        notification.data?.offer_id
      ) {
        setOpen(false);
        navigate(`/offers?offer_id=${notification.data.offer_id}`);
      }
    } else {
      // MARCHAND
      if (notification.type === "reservation") {
        // ✅ Ouvrir le modal avec les détails de la réservation
        let reservationId = null;

        // Extraire reservation_id depuis data (peut être string JSON ou objet)
        if (notification.data) {
          try {
            const data = typeof notification.data === 'string' 
              ? JSON.parse(notification.data) 
              : notification.data;
            reservationId = data.reservation_id;
          } catch (e) {
            console.error('Erreur parsing notification.data:', e);
          }
        }

        if (reservationId) {
          setOpen(false);
          setSelectedReservationId(reservationId);
        } else {
          // Ancienne notification sans reservation_id
          alert('Bu bildirim eski bir bildirim olduğu için rezervasyon detaylarını içermiyor.');
        }
      } else if (
        (notification.type === "offer_expired" || notification.type === "stock_empty") &&
        notification.data?.offer_id
      ) {
        setOpen(false);
        navigate("/merchant/dashboard");
      }
    }
  };

  const markAsRead = async (id: string) => {
    if (hookMarkAsRead) {
      await hookMarkAsRead(id);
    } else {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (hookMarkAllAsRead) {
      await hookMarkAllAsRead();
    } else {
      if (!user) return;
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("recipient_id", user.id)
        .eq("is_read", false);
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "offer":
      case "offer_nearby":
        return "🎁";
      case "reservation":
        return "📋";
      case "offer_expired":
        return "⏰";
      case "stock_empty":
        return "📦";
      case "system":
        return "🔔";
      default:
        return "📢";
    }
  };

  const getNotificationBorderColor = (type?: string) => {
    switch (type) {
      case "offer":
      case "offer_nearby":
        return "border-l-[#00A690]";
      case "reservation":
        return "border-l-blue-500";
      case "offer_expired":
        return "border-l-[#00A690]";
      case "stock_empty":
        return "border-l-red-500";
      case "system":
        return "border-l-purple-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <>
      <div ref={bellRef} className="relative select-none">
        <button
          onClick={() => setOpen(!open)}
          className={`relative p-2 rounded-full hover:bg-gray-100 transition-all ${
            shake ? "animate-shake" : ""
          }`}
          aria-label="Bildirimler"
        >
          <Bell
            className="w-6 h-6 text-[#FFFFF0] hover:text-[#F75C00] transition-colors duration-300"
          />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 border-2 border-white animate-pulse shadow-lg">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-[#F5E6D3]">
              <h3 className="text-sm font-bold text-gray-800">
                Bildirimler {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              {notifications.length > 0 && unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#00A690] hover:text-[#F75C00] font-medium hover:underline transition-colors duration-300"
                >
                  Tümünü Okundu İşaretle
                </button>
              )}
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Bildirim Yok</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Yeni teklifler ve rezervasyonlardan burada bilgilendirileceksiniz
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all hover:bg-gray-50 ${
                      !n.is_read
                        ? `bg-[#F5E6D3] border-l-4 ${getNotificationBorderColor(n.type)}`
                        : "bg-white border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00A690] flex items-center justify-center text-lg shadow-sm">
                        {getNotificationIcon(n.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {n.title && (
                          <p className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                            {n.title}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                          <span>🕒</span>
                          {new Date(n.created_at).toLocaleString("tr-TR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {!n.is_read && (
                        <div className="flex-shrink-0 w-2.5 h-2.5 bg-[#00A690] rounded-full mt-1 shadow-sm"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <style>{`
          @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
            20%, 40%, 60%, 80% { transform: rotate(10deg); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>

      {/* Modal de détails de réservation */}
      {selectedReservationId && (
        <ReservationDetailsModal
          reservationId={selectedReservationId}
          onClose={() => setSelectedReservationId(null)}
        />
      )}
    </>
  );
}