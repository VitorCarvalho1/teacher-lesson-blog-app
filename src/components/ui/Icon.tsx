import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export type IconName =
  | 'home'
  | 'posts'
  | 'write'
  | 'users'
  | 'logout'
  | 'menu'
  | 'close'
  | 'panel'
  | 'search'
  | 'calendar'
  | 'chevronLeft'
  | 'chevronRight'
  | 'sun'
  | 'moon'
  | 'eye'
  | 'eyeOff'
  | 'lock'
  | 'check'
  | 'trash'
  | 'plus'
  | 'info'
  | 'alert'
  | 'checkCircle';

const ICON_MAP: Record<IconName, keyof typeof Feather.glyphMap> = {
  home: 'home',
  posts: 'book-open',
  write: 'edit-3',
  users: 'users',
  logout: 'log-out',
  menu: 'menu',
  close: 'x',
  panel: 'sidebar',
  search: 'search',
  calendar: 'calendar',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  sun: 'sun',
  moon: 'moon',
  eye: 'eye',
  eyeOff: 'eye-off',
  lock: 'lock',
  check: 'check',
  trash: 'trash-2',
  plus: 'plus',
  info: 'info',
  alert: 'alert-circle',
  checkCircle: 'check-circle',
};

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export default function Icon({ name, size = 20, color }: IconProps) {
  const { colors } = useTheme();
  const iconColor = color || colors.text;
  const featherName = ICON_MAP[name] ?? 'help-circle';

  return <Feather name={featherName} size={size} color={iconColor} />;
}
