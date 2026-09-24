type P = {color: string; size?: number};

export const ChevronLeft: React.FC<P> = ({color, size = 22}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 5l-7 7 7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRight: React.FC<P> = ({color, size = 22}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRight: React.FC<P> = ({color, size = 18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Check: React.FC<P> = ({color, size = 16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HomeIcon: React.FC<P> = ({color, size = 24}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-4.5v-5.5h-5V20H5a1 1 0 01-1-1v-8.5z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const CalendarIcon: React.FC<P> = ({color, size = 24}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="5.5" width="16" height="14.5" rx="3" stroke={color} strokeWidth="1.8" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const LeafIcon: React.FC<P> = ({color, size = 24}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 19C5 11 10 5 19 5c0 9-6 14-14 14z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M5 19l8-8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const UserIcon: React.FC<P> = ({color, size = 24}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8.5" r="3.8" stroke={color} strokeWidth="1.8" />
    <path d="M4.5 20c1.2-3.6 4-5.3 7.5-5.3s6.3 1.7 7.5 5.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const ClockIcon: React.FC<P> = ({color, size = 16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
    <path d="M12 7.5V12l3 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const PinIcon: React.FC<P> = ({color, size = 16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" stroke={color} strokeWidth="1.8" />
    <circle cx="12" cy="9.5" r="2.5" stroke={color} strokeWidth="1.8" />
  </svg>
);

export const ImageIcon: React.FC<P> = ({color, size = 28}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="4.5" width="17" height="15" rx="3" stroke={color} strokeWidth="1.5" />
    <circle cx="9" cy="10" r="1.8" stroke={color} strokeWidth="1.5" />
    <path d="M4 17l5-4.5 3.5 3 3-2.5L20 17" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
