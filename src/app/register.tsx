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
import Svg, { Path } from 'react-native-svg';

import { Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Font, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/hooks/use-theme';

// ─── helpers ──────────────────────────────────────────────────

function getPasswordStrength(pwd: string): 1 | 2 | 3 {
  if (!pwd || pwd.length < 6) return 1;
  const variety = [/[A-Z]/, /[a-z]/, /\d/, /[^a-zA-Z0-9]/].filter((r) => r.test(pwd)).length;
  if (pwd.length >= 10 && variety >= 3) return 3;
  if (pwd.length >= 8 && variety >= 2) return 2;
  return 1;
}

function isCampusEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Google G icon (react-native-svg) ─────────────────────────

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <Svg viewBox="0 0 48 48" width={size} height={size}>
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

// ─── RM_TextField ──────────────────────────────────────────────
// Matches the design's RM_TextField: mono uppercase label,
// optional hint (green when ok=true, ink-3 otherwise),
// optional leading icon, optional trailing node.

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  mono = false,
  secure = false,
  leading,
  trailing,
  hint,
  ok = false,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  mono?: boolean;
  secure?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  hint?: string;
  ok?: boolean;
}) {
  const theme = useTheme();
  const borderColor = ok
    ? theme.route + '73' // ~45% opacity green
    : theme.hairline2;

  return (
    <View>
      <View style={styles.fieldLabelRow}>
        <ThemedText type="monoTag" themeColor="ink3" style={styles.fieldLabel}>
          {label}
        </ThemedText>
        {hint ? (
          <View style={styles.hintRow}>
            {ok && <Icon.check size={11} color={theme.routeInk} />}
            <ThemedText
              type="monoMeta"
              style={[styles.hintText, { color: ok ? theme.routeInk : theme.ink3 }]}>
              {hint}
            </ThemedText>
          </View>
        ) : null}
      </View>
      <View style={[styles.field, { backgroundColor: theme.background, borderColor }]}>
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
            { color: theme.text, fontFamily: mono ? Font.mono['600'] : Font.sans['600'] },
          ]}
        />
        {trailing}
      </View>
    </View>
  );
}

// ─── RM_Strength ───────────────────────────────────────────────
// 3-segment password strength bar. Level 1 = Lemah, 2 = Sedang, 3 = Kuat.

function StrengthMeter({ level }: { level: 1 | 2 | 3 }) {
  const theme = useTheme();
  const labels: Record<1 | 2 | 3, string> = { 1: 'Lemah', 2: 'Sedang', 3: 'Kuat' };
  return (
    <View style={styles.strengthRow}>
      <View style={styles.strengthBars}>
        {([0, 1, 2] as const).map((i) => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              { backgroundColor: i < level ? theme.route : theme.hairline2 },
            ]}
          />
        ))}
      </View>
      <ThemedText type="monoMeta" style={[styles.strengthLabel, { color: theme.routeInk }]}>
        {labels[level]}
      </ThemedText>
    </View>
  );
}

// ─── RM_Checkbox ───────────────────────────────────────────────

function Checkbox({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Pressable onPress={onToggle} style={styles.checkboxRow} hitSlop={8}>
      <View
        style={[
          styles.checkboxBox,
          {
            backgroundColor: checked ? theme.text : theme.background,
            borderColor: checked ? theme.text : theme.hairline2,
          },
        ]}>
        {checked && <Icon.check size={11} color={theme.background} />}
      </View>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.checkboxLabel}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

// ─── RegisterScreen ────────────────────────────────────────────

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const emailOk = isCampusEmail(email);
  const strength = password ? getPasswordStrength(password) : null;

  const register = async () => {
    setErrorMsg('');
    if (!name.trim()) { setErrorMsg('Nama lengkap tidak boleh kosong.'); return; }
    if (!emailOk) { setErrorMsg('Masukkan email yang valid.'); return; }
    if (!password || password.length < 6) { setErrorMsg('Kata sandi minimal 6 karakter.'); return; }
    if (!terms) { setErrorMsg('Setujui ketentuan terlebih dahulu.'); return; }

    setIsLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setIsLoading(false);

    if (error) {
      setErrorMsg('Pendaftaran gagal. Coba lagi.');
      return;
    }
    // Route guard redirects to / when session is established.
    // For email-confirmation flows, stay on login instead.
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + Spacing.two, paddingBottom: Spacing.six }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Top strip: back + eyebrow + Bantuan */}
          <View style={[styles.gutter, styles.topStrip]}>
            <Pressable
              onPress={() => router.back()}
              style={[styles.backBtn, { backgroundColor: theme.background, borderColor: theme.hairline2 }]}
              hitSlop={8}>
              <View style={{ transform: [{ scaleX: -1 }] }}>
                <Icon.arrow size={15} color={theme.text} />
              </View>
            </Pressable>
            <ThemedText type="monoTag" themeColor="ink3" style={styles.eyebrow}>
              Daftar · Akun
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.bold}>
              Bantuan
            </ThemedText>
          </View>

          {/* Heading */}
          <View style={[styles.gutter, { marginTop: Spacing.four }]}>
            <ThemedText type="display" style={{ fontSize: 27, lineHeight: 29 }}>
              Buat akun untuk{'\n'}mulai menjelajah.
            </ThemedText>
            <ThemedText
              type="body"
              themeColor="textSecondary"
              style={{ marginTop: Spacing.two, maxWidth: 300 }}>
              Daftar pakai email kampus. Akun mahasiswa diverifikasi otomatis.
            </ThemedText>
          </View>

          {/* Form */}
          <View style={[styles.gutter, { marginTop: Spacing.four, gap: Spacing.three }]}>
            <Field
              label="Nama lengkap"
              value={name}
              onChangeText={setName}
              placeholder="Nama kamu"
              leading={<Icon.info size={14} color={theme.ink3} />}
            />

            <Field
              label="NRP / email kampus"
              value={email}
              onChangeText={setEmail}
              placeholder="NRP atau email kampus"
              mono
              hint={emailOk ? 'Terverifikasi' : undefined}
              ok={emailOk}
            />

            <View style={{ gap: 0 }}>
              <Field
                label="Buat kata sandi"
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
              {strength && <StrengthMeter level={strength} />}
            </View>

            <Checkbox checked={terms} onToggle={() => setTerms((v) => !v)}>
              {'Saya setuju dengan '}
              <ThemedText type="caption" style={styles.bold}>Ketentuan</ThemedText>
              {' & '}
              <ThemedText type="caption" style={styles.bold}>Kebijakan Privasi</ThemedText>
              {' Direktori Kampus.'}
            </Checkbox>

            {errorMsg ? (
              <ThemedText type="caption" style={{ color: '#c0392b' }}>
                {errorMsg}
              </ThemedText>
            ) : null}

            {/* Primary CTA */}
            <Pressable
              onPress={register}
              disabled={isLoading}
              style={({ pressed }) => [{ marginTop: Spacing.one }, (pressed || isLoading) && styles.pressed]}>
              <View style={[styles.cta, { backgroundColor: theme.route }]}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <ThemedText type="titleM" style={{ color: '#fff', fontSize: 15 }}>
                      Daftar
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

            {/* Google OAuth */}
            <Pressable
              onPress={async () => {
                setErrorMsg('');
                setIsGoogleLoading(true);
                const { error } = await signInWithGoogle();
                setIsGoogleLoading(false);
                if (error) setErrorMsg('Login Google gagal. Coba lagi.');
              }}
              disabled={isGoogleLoading || isLoading}
              style={({ pressed }) => (pressed || isGoogleLoading) && styles.pressed}>
              <View style={[styles.sso, { backgroundColor: theme.background, borderColor: theme.hairline2 }]}>
                {isGoogleLoading
                  ? <ActivityIndicator size="small" color={theme.text} />
                  : <><GoogleG size={18} /><ThemedText type="caption" style={styles.bold}>Daftar dengan akun Google</ThemedText></>
                }
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            styles.gutter,
            { borderColor: theme.hairline, paddingBottom: insets.bottom + Spacing.three },
          ]}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ThemedText type="caption" themeColor="textSecondary">
              Sudah punya akun?{' '}
              <ThemedText type="caption" style={styles.bold}>
                Masuk
              </ThemedText>
            </ThemedText>
          </Pressable>
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

  topStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: { flex: 1, letterSpacing: 1.5 },

  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fieldLabel: { letterSpacing: 1.4, fontSize: 10 },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hintText: { fontSize: 10, fontFamily: Font.sans['600'] },

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

  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  strengthBars: { flex: 1, flexDirection: 'row', gap: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 999 },
  strengthLabel: { fontSize: 10.5, fontFamily: Font.sans['700'] },

  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  checkboxBox: {
    width: 16,
    height: 16,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxLabel: { flex: 1, lineHeight: 18 },

  cta: {
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginVertical: Spacing.one,
  },
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
});
