import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Font, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/hooks/use-theme';

type Role = 'mahasiswa' | 'admin';

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  mono = false,
  secure = false,
  leading,
  trailing,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  mono?: boolean;
  secure?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View>
      <ThemedText type="monoTag" themeColor="ink3" style={styles.fieldLabel}>
        {label}
      </ThemedText>
      <View style={[styles.field, { backgroundColor: theme.background, borderColor: theme.hairline2 }]}>
        {leading}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.ink3}
          secureTextEntry={secure}
          autoCapitalize="none"
          style={[
            styles.input,
            { color: theme.text, fontFamily: mono ? Font.mono['500'] : Font.sans['500'] },
          ]}
        />
        {trailing}
      </View>
    </View>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { signIn } = useAuth();

  const [role, setRole] = useState<Role>('mahasiswa');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const enter = async () => {
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Email tidak boleh kosong.');
      return;
    }
    if (!password) {
      setErrorMsg('Kata sandi tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email.trim(), password);
    setIsLoading(false);

    if (error) {
      setErrorMsg('Email atau kata sandi salah.');
      return;
    }

    // Route guard in _layout.tsx handles the redirect after successful login
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + Spacing.two, paddingBottom: Spacing.six }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Top strip */}
          <View style={[styles.gutter, styles.rowBetween]}>
            <View style={styles.eyebrow}>
              <View style={[styles.eyebrowRing, { backgroundColor: theme.route + '38' }]}>
                <View style={[styles.eyebrowDot, { backgroundColor: theme.route }]} />
              </View>
              <ThemedText type="monoTag" themeColor="ink3">
                Direktori · Kampus
              </ThemedText>
            </View>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.bold}>
              Bantuan
            </ThemedText>
          </View>

          {/* Brand */}
          <View style={[styles.gutter, { marginTop: Spacing.five }]}>
            <View style={[styles.brandTile, { backgroundColor: theme.text }]}>
              <Icon.pinFill size={28} color={theme.route} />
            </View>
            <ThemedText type="display" style={{ fontSize: 28, marginTop: Spacing.five }}>
              Masuk untuk lihat unit di kampusmu.
            </ThemedText>
            <ThemedText type="body" themeColor="textSecondary" style={{ marginTop: Spacing.two, maxWidth: 300 }}>
              Pakai akun SSO kampus. Sesi tersimpan di perangkat ini.
            </ThemedText>
          </View>

          {/* Role segment */}
          <View style={[styles.gutter, { marginTop: Spacing.five }]}>
            <View style={[styles.segment, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline }]}>
              {(['mahasiswa', 'admin'] as Role[]).map((r) => {
                const active = role === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() => setRole(r)}
                    style={[
                      styles.segmentItem,
                      active && {
                        backgroundColor: theme.background,
                        borderColor: theme.hairline2,
                        borderWidth: 1,
                        shadowColor: '#141e19',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                      },
                    ]}>
                    <ThemedText
                      type="caption"
                      themeColor={active ? 'text' : 'textSecondary'}
                      style={active ? styles.bold : undefined}>
                      {r === 'mahasiswa' ? 'Mahasiswa' : 'Admin / Staf'}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Form */}
          <View style={[styles.gutter, { marginTop: Spacing.five, gap: Spacing.three }]}>
            <Field
              label="NRP atau email kampus"
              value={email}
              onChangeText={setEmail}
              mono
              leading={<Icon.info size={14} color={theme.ink3} />}
            />
            <Field
              label="Kata sandi"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secure={!showPassword}
              trailing={
                <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                  <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </ThemedText>
                </Pressable>
              }
            />

            {errorMsg ? (
              <ThemedText type="caption" style={{ color: '#c0392b' }}>
                {errorMsg}
              </ThemedText>
            ) : null}

            <View style={styles.rowBetween}>
              <Pressable onPress={() => setRemember((v) => !v)} style={styles.remember} hitSlop={8}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: remember ? theme.text : theme.background,
                      borderColor: remember ? theme.text : theme.hairline2,
                    },
                  ]}>
                  {remember ? <Icon.check size={11} color={theme.background} /> : null}
                </View>
                <ThemedText type="caption" themeColor="textSecondary">
                  Ingat saya
                </ThemedText>
              </Pressable>
              <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
                Lupa sandi?
              </ThemedText>
            </View>

            {/* Primary CTA */}
            <Pressable
              onPress={enter}
              disabled={isLoading}
              style={({ pressed }) => (pressed || isLoading) && styles.pressed}>
              <View style={[styles.cta, { backgroundColor: theme.route }]}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <ThemedText type="titleM" style={{ color: '#fff', fontSize: 15 }}>
                      Masuk
                    </ThemedText>
                    <Icon.arrow size={16} color="#fff" />
                  </>
                )}
              </View>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: theme.hairline }]} />
              <ThemedText type="monoTag" themeColor="ink3">
                atau
              </ThemedText>
              <View style={[styles.divider, { backgroundColor: theme.hairline }]} />
            </View>

            {/* SSO — TODO: wire OAuth provider login */}
            <Pressable disabled style={styles.pressed}>
              <View style={[styles.sso, { backgroundColor: theme.background, borderColor: theme.hairline2 }]}>
                <View style={[styles.ssoMark, { backgroundColor: theme.text }]}>
                  <ThemedText type="monoMeta" style={{ color: theme.background, fontSize: 11 }}>
                    K
                  </ThemedText>
                </View>
                <ThemedText type="caption" style={styles.bold}>
                  Lanjut dengan SSO Kampus
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, styles.gutter, { borderColor: theme.hairline, paddingBottom: insets.bottom + Spacing.three }]}>
          <ThemedText type="caption" themeColor="textSecondary">
            Belum punya akun?{' '}
            <ThemedText type="caption" style={styles.bold}>
              Daftar
            </ThemedText>
          </ThemedText>
          <ThemedText type="monoMeta" themeColor="ink3" style={{ fontSize: 10 }}>
            v1.0.0
          </ThemedText>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gutter: { paddingHorizontal: Spacing.five },
  bold: { fontWeight: '700' },
  pressed: { opacity: 0.7 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrowRing: { width: 12, height: 12, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  eyebrowDot: { width: 6, height: 6, borderRadius: 999 },
  brandTile: {
    width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#141e19',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segment: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 12, borderWidth: 1 },
  segmentItem: { flex: 1, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { letterSpacing: 1.4, marginBottom: 6, fontSize: 10 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    height: 50,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: 14, padding: 0 },
  remember: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  checkbox: { width: 16, height: 16, borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cta: {
    marginTop: Spacing.two,
    height: 52,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    shadowColor: '#005a37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginVertical: Spacing.one },
  divider: { flex: 1, height: 1 },
  sso: {
    height: 46,
    borderRadius: Radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  ssoMark: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
});
