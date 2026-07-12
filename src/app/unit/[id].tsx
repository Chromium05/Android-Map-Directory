import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloorBadge, PhotoSlot, StatusPill } from '@/components/atoms';
import { Glyph, Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { getUnitDetail } from '@/services/api';
import type { Unit, UnitRoom } from '@/types/database';
import { formatDistance, getDistanceKm } from '@/utils/distance';
import { openRoute } from '@/utils/navigation';
import { formatHoursRange } from '@/utils/time';

function CircleButton({ children, onPress, active = false }: { children: React.ReactNode; onPress?: () => void; active?: boolean }) {
  const theme = useTheme();
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.topBtn, 
        { 
          backgroundColor: active ? theme.routeTint : theme.background + 'ec', 
          borderColor: active ? theme.route : theme.hairline 
        },
        pressed && styles.pressed
      ]}>
      {children}
    </Pressable>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono = false,
  accent = false,
}: {
  icon: string;
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  const theme = useTheme();
  const I = Icon[icon as keyof typeof Icon] || Icon.info;
  return (
    <View style={[styles.infoRow, { borderColor: theme.hairline }]}>
      <View style={[styles.infoIcon, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline }]}>
        <I size={15} color={accent ? theme.routeInk : theme.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="monoTag" themeColor="ink3" style={{ letterSpacing: 1 }}>
          {label}
        </ThemedText>
        <ThemedText type={mono ? 'code' : 'defaultSemiBold'} style={{ marginTop: 3, fontSize: 13 }}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

function SubRooms({ rooms }: { rooms: UnitRoom[] }) {
  const theme = useTheme();
  return (
    <View style={[styles.subWrap, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
      <View style={[styles.subHead, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline }]}>
        <ThemedText type="caption" style={styles.extrabold}>
          Ruangan di unit ini
        </ThemedText>
        <ThemedText type="monoMeta" themeColor="ink3" style={{ fontSize: 10 }}>
          {rooms.length} ruang
        </ThemedText>
      </View>
      {rooms.map((r, i) => (
        <View
          key={i}
          style={[styles.subRow, i < rooms.length - 1 && { borderBottomWidth: 1, borderColor: theme.hairline }]}>
          <ThemedText type="caption" style={styles.semibold}>
            {r.name}
          </ThemedText>
          <ThemedText type="monoMeta" themeColor="routeInk" style={styles.semibold}>
            {r.location}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

function QuickAction({ tag, label, value, onPress }: { tag: string; label: string; value: string; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.quick, 
        { backgroundColor: theme.background, borderColor: theme.hairline2 },
        pressed && styles.pressed
      ]}>
      <View style={[styles.quickTag, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText type="monoMeta" style={{ fontSize: 11 }}>
          {tag}
        </ThemedText>
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="monoTag" themeColor="ink3" style={{ letterSpacing: 0.8 }}>
          {label}
        </ThemedText>
        <ThemedText type="caption" style={styles.bold} numberOfLines={1}>
          {value}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const location = useLocation();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUnitDetail(Number(id));
      if (!data) throw new Error('Unit tidak ditemukan');
      setUnit(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail unit');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      !isFavorite ? 'Ditambahkan' : 'Dihapus',
      !isFavorite ? `${unit?.name} telah ditambahkan ke favorit.` : `${unit?.name} dihapus dari favorit.`
    );
  };

  const openPhone = () => {
    Linking.openURL('tel:+62315941234');
  };

  const openWeb = () => {
    Linking.openURL('https://ti.kampus.ac.id');
  };

  const showMoreOptions = () => {
    Alert.alert('Opsi Lainnya', 'Pilih tindakan untuk unit ini:', [
      { text: 'Bagikan', onPress: () => Alert.alert('Berbagi', 'Fitur berbagi akan segera hadir.') },
      { text: 'Laporkan Kesalahan', onPress: () => Alert.alert('Lapor', 'Terima kasih, laporan Anda telah kami terima.') },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.route} />
        <ThemedText type="caption" style={{ marginTop: Spacing.two }}>Memuat detail...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !unit) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <Icon.info size={48} color={theme.closed} />
        <ThemedText type="titleM" style={{ marginTop: Spacing.two }}>{error || 'Unit tidak ditemukan'}</ThemedText>
        <Pressable onPress={() => router.back()} style={[styles.retryBtn, { backgroundColor: theme.route }]}>
          <ThemedText type="caption" style={[styles.bold, { color: '#fff' }]}>Kembali</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const glyphName = unit.categories?.glyph || 'dept';
  const G = Glyph[glyphName];
  const distanceKm = getDistanceKm(location.latitude, location.longitude, Number(unit.lat), Number(unit.lng));
  const { value: dist, unit: distUnit } = formatDistance(distanceKm);
  
  // ETA calculation: average walking speed ~5km/h = 83m/min
  const etaMinutes = Math.max(1, Math.round((distanceKm * 1000) / 83));

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.four }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View>
          <View style={[styles.topBar, { top: insets.top + Spacing.one }]}>
            <CircleButton onPress={() => router.back()}>
              <View style={styles.flip}>
                <Icon.chev size={16} color={theme.text} />
              </View>
            </CircleButton>
            <View style={styles.topRight}>
              <CircleButton active={isFavorite} onPress={toggleFavorite}>
                <Icon.star size={15} color={isFavorite ? theme.route : theme.ink3} />
              </CircleButton>
              <CircleButton onPress={showMoreOptions}>
                <ThemedText type="titleM" style={{ color: theme.text }}>⋯</ThemedText>
              </CircleButton>
            </View>
          </View>
          <PhotoSlot height={240} radius={0} label={`foto · ${unit.buildings?.name.toLowerCase() || 'tempat'}`} />
          <View style={styles.heroFloor}>
            <FloorBadge building={unit.buildings?.name || ''} floor={unit.floor} />
          </View>
        </View>

        {/* Body */}
        <View style={[styles.gutter, { paddingTop: Spacing.four }]}>
          <View style={styles.rowBetween}>
            <View style={styles.catRow}>
              <G size={13} color={theme.routeInk} />
              <ThemedText type="monoTag" themeColor="routeInk" style={{ letterSpacing: 1.2 }}>
                {unit.categories?.name}
              </ThemedText>
            </View>
            <View style={styles.ratingRow}>
              <Icon.star size={13} color="#d99a3a" />
              <ThemedText type="caption" style={styles.bold}>
                {unit.rating}
              </ThemedText>
              <ThemedText type="caption" themeColor="ink3">
                · 124 ulasan
              </ThemedText>
            </View>
          </View>

          <ThemedText type="display" style={{ fontSize: 22, marginTop: Spacing.one }}>
            {unit.name}
          </ThemedText>

          <View style={[styles.metaRow, { marginTop: Spacing.two }]}>
            <StatusPill status={unit.status} />
            <View style={[styles.tinyDot, { backgroundColor: theme.ink3 }]} />
            <ThemedText type="caption" themeColor="textSecondary">
              <ThemedText type="code" style={{ color: theme.text }}>
                {dist} {distUnit}
              </ThemedText>{' '}
              dari kamu
            </ThemedText>
            <View style={[styles.tinyDot, { backgroundColor: theme.ink3 }]} />
            <ThemedText type="code" themeColor="textSecondary">
              ~{etaMinutes} menit
            </ThemedText>
          </View>

          {unit.description ? (
            <ThemedText type="body" themeColor="textSecondary" style={{ marginTop: Spacing.three, lineHeight: 21 }}>
              {unit.description}
            </ThemedText>
          ) : null}

          <View style={{ marginTop: Spacing.three }}>
            <InfoRow icon="pin" label="Lokasi" value={`${unit.buildings?.name} · ${unit.floor}`} accent />
            <InfoRow icon="info" label="Alamat" value={unit.address} />
            <InfoRow icon="star" label="Jam Layanan" value={formatHoursRange(unit.open_hours, unit.close_hours)} mono />
            <InfoRow icon="locate" label="Koordinat" value={`${unit.lat}, ${unit.lng}`} mono />
          </View>

          {unit.unit_rooms && unit.unit_rooms.length > 0 ? (
            <View style={{ marginTop: Spacing.four }}>
              <SubRooms rooms={unit.unit_rooms} />
            </View>
          ) : null}

          <View style={styles.quickGrid}>
            <QuickAction tag="SMS" label="Kontak" value="+62 31 594 1234" onPress={openPhone} />
            <QuickAction tag="WEB" label="Situs" value="ti.kampus.ac.id" onPress={openWeb} />
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View
        style={[
          styles.cta,
          { backgroundColor: theme.background, borderColor: theme.hairline, paddingBottom: insets.bottom + Spacing.three },
        ]}>
        <Pressable
          onPress={() => router.push({ pathname: '/peta', params: { focusUnitId: String(unit.id) } })}
          style={({ pressed }) => [
            styles.ctaPin,
            { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 },
            pressed && styles.pressed,
          ]}>
          <Icon.pin size={18} color={theme.text} />
        </Pressable>
        <Pressable 
          onPress={() => router.push({ pathname: '/peta', params: { focusUnitId: String(unit.id), autoRoute: '1' } })}
          style={({ pressed }) => [styles.ctaButton, { backgroundColor: theme.route }, pressed && styles.pressed]}>
          <Icon.map size={18} color="#fff" />
          <ThemedText type="titleM" style={{ color: '#fff' }}>
            Buka Rute · {dist} {distUnit}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  gutter: { paddingHorizontal: Spacing.four },
  bold: { fontWeight: '700' },
  semibold: { fontWeight: '600' },
  extrabold: { fontWeight: '800' },
  pressed: { opacity: 0.7 },
  flip: { transform: [{ rotate: '180deg' }] },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  topBar: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topRight: { flexDirection: 'row', gap: Spacing.two },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFloor: { position: 'absolute', bottom: 18, left: Spacing.four },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, flexWrap: 'wrap' },
  tinyDot: { width: 3, height: 3, borderRadius: 999 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three, paddingVertical: Spacing.three, borderBottomWidth: 1 },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subWrap: { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  subHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  quickGrid: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four },
  quick: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  quickTag: { width: 30, height: 30, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  cta: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
  ctaPin: { width: 48, height: 48, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ctaButton: {
    flex: 1,
    height: 48,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  retryBtn: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
});
