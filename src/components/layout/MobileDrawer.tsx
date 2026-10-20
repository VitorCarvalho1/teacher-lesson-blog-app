import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/ui/BrandLogo';
import Avatar from '@/components/ui/Avatar';
import Icon, { IconName } from '@/components/ui/Icon';
import ThemeToggle from '@/components/ui/ThemeToggle';
import PasswordChangeModal from '@/components/auth/PasswordChangeModal';
import { getRoleLabel } from '@/utils/user-display';

type MobileDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

type NavItem = {
  to: string;
  label: string;
  description: string;
  icon: IconName;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Início',
    description: 'Visão geral do portal',
    icon: 'home',
    adminOnly: true,
  },
  {
    to: '/posts',
    label: 'Postagens',
    description: 'Aulas publicadas pela comunidade',
    icon: 'posts',
  },
  {
    to: '/posts/new',
    label: 'Nova aula',
    description: 'Publicar uma nova lição',
    icon: 'write',
    adminOnly: true,
  },
  {
    to: '/users',
    label: 'Comunidade',
    description: 'Docentes e estudantes cadastrados',
    icon: 'users',
    adminOnly: true,
  },
];

export default function MobileDrawer({ visible, onClose }: MobileDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, radius } = useTheme();
  const { user, isAdmin, logout, switchRole } = useAuth();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const filteredItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });

  const handleNavigate = (to: string) => {
    onClose();
    router.push(to as any);
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.replace('/login');
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <Pressable
            style={[styles.backdrop, { backgroundColor: colors.overlay }]}
            onPress={onClose}
          />
          <View
            style={[
              styles.drawer,
              {
                backgroundColor: colors.surface,
                borderRightColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.drawerHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <BrandLogo size="sm" showTagline={false} />
              <View style={styles.headerActions}>
                <ThemeToggle />
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                  accessibilityLabel="Fechar menu"
                >
                  <Icon name="close" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Role Switcher for previewing both Admin and Member views */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={switchRole}
              style={[
                styles.roleSwitchCard,
                {
                  backgroundColor: isAdmin ? colors.accentSoft : colors.primarySoft,
                  borderColor: isAdmin ? colors.accent : colors.primary,
                  borderRadius: radius.md,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.roleSwitchTitle,
                    { color: isAdmin ? colors.accent : colors.primary },
                  ]}
                >
                  Perfil: {user ? getRoleLabel(user.role) : 'Visitante'}
                </Text>
                <Text
                  style={[
                    styles.roleSwitchHint,
                    { color: colors.textMuted },
                  ]}
                >
                  Toque para alternar para {isAdmin ? 'Membro' : 'Administrador'}
                </Text>
              </View>
              <Icon
                name="users"
                size={16}
                color={isAdmin ? colors.accent : colors.primary}
              />
            </TouchableOpacity>

            <ScrollView style={styles.navSection}>
              <Text
                style={[
                  styles.navHeading,
                  { color: colors.textMuted },
                ]}
              >
                Navegação
              </Text>
              <View style={styles.navList}>
                {filteredItems.map((item) => {
                  const isActive =
                    item.to === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.to);

                  return (
                    <TouchableOpacity
                      key={item.to}
                      activeOpacity={0.7}
                      onPress={() => handleNavigate(item.to)}
                      style={[
                        styles.navItem,
                        {
                          backgroundColor: isActive
                            ? colors.primarySoft
                            : 'transparent',
                          borderRadius: radius.md,
                        },
                      ]}
                    >
                      <View style={styles.navIcon}>
                        <Icon
                          name={item.icon}
                          size={18}
                          color={isActive ? colors.primary : colors.text}
                        />
                      </View>
                      <View style={styles.navCopy}>
                        <Text
                          style={[
                            styles.navLabel,
                            {
                              color: isActive ? colors.primary : colors.text,
                              fontWeight: isActive ? '700' : '500',
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text
                          style={[
                            styles.navDesc,
                            { color: colors.textMuted },
                          ]}
                          numberOfLines={1}
                        >
                          {item.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Profile footer section */}
            {user ? (
              <View
                style={[
                  styles.userSection,
                  {
                    borderTopColor: colors.border,
                    backgroundColor: colors.surfaceMuted,
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPasswordModalVisible(true)}
                  style={styles.profileBox}
                >
                  <Avatar name={user.name} role={user.role} size="md" />
                  <View style={styles.userCopy}>
                    <Text
                      style={[styles.userName, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {user.name}
                    </Text>
                    <Text
                      style={[styles.userEmail, { color: colors.textMuted }]}
                      numberOfLines={1}
                    >
                      {user.email}
                    </Text>
                    <View style={styles.badgeRow}>
                      <Text
                        style={[
                          styles.roleBadge,
                          {
                            color: user.role === 'ADMIN' ? colors.accent : colors.primary,
                            backgroundColor: user.role === 'ADMIN' ? colors.accentSoft : colors.primarySoft,
                          },
                        ]}
                      >
                        {getRoleLabel(user.role)}
                      </Text>
                      <Text
                        style={[styles.pwdLink, { color: colors.primary }]}
                      >
                        Alterar senha
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleLogout}
                  style={[styles.logoutBtn, { borderColor: colors.border }]}
                  accessibilityLabel="Sair da conta"
                >
                  <Icon name="logout" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>

      <PasswordChangeModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawer: {
    width: '82%',
    maxWidth: 320,
    height: '100%',
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    padding: 6,
  },
  roleSwitchCard: {
    margin: 14,
    marginBottom: 6,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleSwitchTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  roleSwitchHint: {
    fontSize: 11,
    marginTop: 2,
  },
  navSection: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  navHeading: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  navList: {
    gap: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 12,
  },
  navIcon: {
    width: 24,
    alignItems: 'center',
  },
  navCopy: {
    flex: 1,
  },
  navLabel: {
    fontSize: 15,
  },
  navDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  userSection: {
    borderTopWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userCopy: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 11,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  pwdLink: {
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
