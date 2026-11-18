import React from "react";
import {
  AlarmClock,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  AlignLeft,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  Ban,
  Bell,
  BellOff,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Code,
  Copy,
  CreditCard,
  Crown,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Gift,
  Globe,
  Image as ImageIcon,
  Info,
  Link2,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Minimize2,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  Sparkles,
  Tag,
  Ticket,
  Trash2,
  Upload,
  User,
  Users,
  Video,
  X,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

// Exporta apenas os ícones necessários no cliente (evita barrel import pesado)

export type LumaIconProps = Omit<LucideProps, "size"> & {
  size?: number | string;
};

function createLumaIcon(
  IconComponent: LucideIcon,
  defaultSize: number,
  filled = false
) {
  const WrappedIcon = ({
    size = defaultSize,
    strokeWidth = 1.75,
    className = "",
    ...props
  }: LumaIconProps) => (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      fill={filled ? "currentColor" : "none"}
      className={`shrink-0 ${className}`.trim()}
      {...props}
    />
  );
  return WrappedIcon;
}

/* ============================================================================
 * Luma Style Guide Icons (16px & 24px)
 * ========================================================================== */

// Navigation & Arrows
export const ArrowDown16 = createLumaIcon(ArrowDown, 16);
export const ArrowLeft16 = createLumaIcon(ArrowLeft, 16);
export function ArrowLeft24({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`.trim()}
      aria-hidden="true"
    >
      <path
        d="M11 18L5.35355 12.3536C5.15829 12.1583 5.15829 11.8417 5.35355 11.6464L11 6M5.5 12H19"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export const ArrowRight16 = createLumaIcon(ArrowRight, 16);
export const ArrowUp16 = createLumaIcon(ArrowUp, 16);
export const ArrowUpRight16 = createLumaIcon(ArrowUpRight, 16);
export const ArrowUturn16 = createLumaIcon(RotateCcw, 16);
export const ArrowsLeftRight16 = createLumaIcon(ArrowLeftRight, 16);
export const ChevronDown16 = createLumaIcon(ChevronDown, 16);
export const ChevronLeft16 = createLumaIcon(ChevronLeft, 16);
export const ChevronRight16 = createLumaIcon(ChevronRight, 16);
export const ChevronUp16 = createLumaIcon(ChevronUp, 16);
export const ExternalLink16 = createLumaIcon(ExternalLink, 16);

// Action & Interface
export const Check16 = createLumaIcon(Check, 16);
export const Check24 = createLumaIcon(Check, 24);
export const Close16 = createLumaIcon(X, 16);
export const Close24 = createLumaIcon(X, 24);
export const Copy16 = createLumaIcon(Copy, 16);
export const Code16 = createLumaIcon(Code, 16);
export const Collapse16 = createLumaIcon(Minimize2, 16);
export const Block16 = createLumaIcon(Ban, 16);
export const AlignLeft16 = createLumaIcon(AlignLeft, 16);
export const Archive16 = createLumaIcon(Archive, 16);
export const Plus16 = createLumaIcon(Plus, 16);
export const Search16 = createLumaIcon(Search, 16);
export const Settings16 = createLumaIcon(Settings, 16);
export const Trash16 = createLumaIcon(Trash2, 16);
export const Upload16 = createLumaIcon(Upload, 16);
export const Link16 = createLumaIcon(Link2, 16);
export const LogOut16 = createLumaIcon(LogOut, 16);

// Communication & Chat
export const Chat16 = createLumaIcon(MessageCircle, 16);
export const Chat24 = createLumaIcon(MessageCircle, 24);
export const ChatFilled16 = createLumaIcon(MessageCircle, 16, true);
export const ArrowChatSend16 = createLumaIcon(Send, 16);
export const At16 = createLumaIcon(AtSign, 16);
export const Mail16 = createLumaIcon(Mail, 16);

// Time & Calendars
export const Calendar16 = createLumaIcon(Calendar, 16);
export const Calendar24 = createLumaIcon(Calendar, 24);
export const CalendarCheck16 = createLumaIcon(CalendarCheck, 16);
export const CalendarClock16 = createLumaIcon(CalendarClock, 16);
export const CalendarPlus16 = createLumaIcon(CalendarPlus, 16);
export const Clock16 = createLumaIcon(Clock, 16);
export const ClockFilled16 = createLumaIcon(Clock, 16, true);
export const Alarm16 = createLumaIcon(AlarmClock, 16);

// Alerts & Status
export const AlertCircle16 = createLumaIcon(AlertCircle, 16);
export const AlertHexagon16 = createLumaIcon(AlertOctagon, 16);
export const AlertTriangle16 = createLumaIcon(AlertTriangle, 16);
export const Bell16 = createLumaIcon(Bell, 16);
export const BellFilled16 = createLumaIcon(Bell, 16, true);
export const BellSlash16 = createLumaIcon(BellOff, 16);
export const CheckCircle16 = createLumaIcon(CheckCircle2, 16);
export const Info16 = createLumaIcon(Info, 16);

// Commerce & Finance
export const CreditCard16 = createLumaIcon(CreditCard, 16);
export const Coupon16 = createLumaIcon(Ticket, 16);
export const CouponFilled16 = createLumaIcon(Ticket, 16, true);
export const CardGift16 = createLumaIcon(Gift, 16);
export const Tag16 = createLumaIcon(Tag, 16);

// Objects, Auth & System
export const Bolt16 = createLumaIcon(Zap, 16);
export const Building16 = createLumaIcon(Building2, 16);
export const Camera16 = createLumaIcon(Camera, 16);
export const Crown16 = createLumaIcon(Crown, 16);
export const CSV16 = createLumaIcon(FileSpreadsheet, 16);
export const Globe16 = createLumaIcon(Globe, 16);
export const Image16 = createLumaIcon(ImageIcon, 16);
export const Video16 = createLumaIcon(Video, 16);
export const Sparkles16 = createLumaIcon(Sparkles, 16);
export const User16 = createLumaIcon(User, 16);
export const Users16 = createLumaIcon(Users, 16);
export const Lock16 = createLumaIcon(Lock, 16);
export const Eye16 = createLumaIcon(Eye, 16);
export const EyeOff16 = createLumaIcon(EyeOff, 16);

// Brand / Custom SVG Icons
export function GoogleIcon({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
        fill="#4285F4"
      />
      <path
        d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
        fill="#EA4335"
      />
    </svg>
  );
}
