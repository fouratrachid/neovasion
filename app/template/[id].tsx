import React, { useRef, useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    Animated,
    Pressable,
    Dimensions,
    FlatList,
    ViewToken,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { useTemplateDetails } from "@/hooks/useTemplateDetails";
import {
    formatTripDate,
    getDurationDays,
    getTripTypeConfig,
} from "@/components/trips/helpers";
import { DetailedTrip, TripFile, DetailedDestination } from "@/components/trips/types";

dayjs.extend(duration);

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 400;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const getIncludeIcon = (type: string): React.ComponentProps<typeof MaterialCommunityIcons>["name"] => {
    switch (type) {
        case "meal": return "silverware-fork-knife";
        case "transport": return "bus-side";
        case "guide": return "account-tie-outline";
        case "accommodation": return "bed-outline";
        case "activity": return "kayaking";
        default: return "check-circle-outline";
    }
};

const getIncludeColor = (type: string) => {
    switch (type) {
        case "meal": return { bg: "#FFF7ED", icon: "#EA580C", text: "#9A3412" };
        case "transport": return { bg: "#EFF6FF", icon: "#2563EB", text: "#1D4ED8" };
        case "guide": return { bg: "#F0FDF4", icon: "#16A34A", text: "#15803D" };
        case "accommodation": return { bg: "#F5F3FF", icon: "#7C3AED", text: "#6D28D9" };
        default: return { bg: "#F0FDF4", icon: "#059669", text: "#047857" };
    }
};

const getTotalDuration = (template: DetailedTrip): number => {
    if (!template.destination || template.destination.length === 0) return 0;
    const first = template.destination[0].date_start;
    const last = template.destination[template.destination.length - 1].date_end;
    return getDurationDays(first, last) ?? 0;
};

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export default function TemplateDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { template, isLoading, error, refetch } = useTemplateDetails(id as string);
    const scrollY = useRef(new Animated.Value(0)).current;

    // Animated header opacity
    const headerOpacity = scrollY.interpolate({
        inputRange: [HERO_HEIGHT - 100, HERO_HEIGHT - 20],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    if (isLoading) {
        return (
            <SafeAreaView style={styles.centered}>
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
                <Text style={styles.loadingTitle}>Loading Template</Text>
                <Text style={styles.loadingSubtitle}>Preparing your perfect trip…</Text>
            </SafeAreaView>
        );
    }

    if (error || !template) {
        return (
            <SafeAreaView style={styles.centered}>
                <View style={[styles.loadingBox, { backgroundColor: "#FEF2F2" }]}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={32} color="#DC2626" />
                </View>
                <Text style={styles.loadingTitle}>Failed to load</Text>
                <Text style={styles.loadingSubtitle}>{error ?? "An unexpected error occurred."}</Text>
                <Pressable onPress={() => void refetch()} style={styles.retryBtn}>
                    <MaterialCommunityIcons name="refresh" size={16} color="#FFF" />
                    <Text style={styles.retryText}>Try Again</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const totalDays = getTotalDuration(template);
    const typeConfig = getTripTypeConfig(template.type_trip);

    return (
        <View style={styles.root}>
            {/* Floating animated header bar */}
            <Animated.View
                style={[styles.floatingHeader, { opacity: headerOpacity }]}
                pointerEvents="none"
            >
                <Text style={styles.floatingHeaderTitle} numberOfLines={1}>
                    {template.title_trip}
                </Text>
            </Animated.View>

            {/* Back Button */}
            <View style={styles.backBtnWrapper}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
                </Pressable>
            </View>

            <Animated.ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* ── Hero Carousel ── */}
                <HeroCarousel
                    files={template.files_trip ?? []}
                    type={template.type_trip}
                    scrollY={scrollY}
                />

                {/* ── White card body ── */}
                <View style={styles.cardBody}>
                    {/* Template Badge */}
                    <View style={styles.templateBadgeRow}>
                        <View style={styles.templateBadge}>
                            <MaterialCommunityIcons name="star-four-points" size={11} color="#7C3AED" />
                            <Text style={styles.templateBadgeText}>READY-MADE TEMPLATE</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{template.title_trip}</Text>

                    {/* Meta Row */}
                    <View style={styles.metaRow}>
                        {template.date_depart && (
                            <View style={styles.metaChip}>
                                <MaterialCommunityIcons name="calendar-month-outline" size={14} color="#4F46E5" />
                                <Text style={styles.metaText}>{formatTripDate(template.date_depart)}</Text>
                            </View>
                        )}
                        {totalDays > 0 && (
                            <View style={styles.metaChip}>
                                <MaterialCommunityIcons name="clock-outline" size={14} color="#4F46E5" />
                                <Text style={styles.metaText}>{totalDays} Days</Text>
                            </View>
                        )}
                        {template.destination && template.destination.length > 0 && (
                            <View style={styles.metaChip}>
                                <MaterialCommunityIcons name="map-marker-multiple-outline" size={14} color="#4F46E5" />
                                <Text style={styles.metaText}>{template.destination.length} Stops</Text>
                            </View>
                        )}
                    </View>

                    {/* Categories */}
                    {template.categorie && template.categorie.length > 0 && (
                        <View style={styles.categoryRow}>
                            {template.categorie.map((cat) => (
                                <View key={cat._id} style={styles.categoryChip}>
                                    <Text style={styles.categoryText}>{cat.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Description */}
                    <SectionHeader icon="text-box-outline" title="Overview" />
                    <Text style={styles.descText}>{template.desc_trip}</Text>

                    {/* Special Note */}
                    {template.note_special && (
                        <View style={styles.noteBox}>
                            <MaterialCommunityIcons name="information-outline" size={18} color="#B45309" />
                            <Text style={styles.noteText}>
                                <Text style={styles.noteBold}>Note: </Text>
                                {template.note_special}
                            </Text>
                        </View>
                    )}

                    {/* Keywords */}
                    {template.mot_cle && template.mot_cle.length > 0 && (
                        <View style={styles.keywordsRow}>
                            {template.mot_cle.map((kw) => (
                                <View key={kw} style={styles.keyword}>
                                    <Text style={styles.keywordText}>#{kw}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Departure */}
                    {template.depart && template.depart.length > 0 && (
                        <>
                            <SectionHeader icon="airplane-takeoff" title="Departure" />
                            {template.depart.map((dep) => (
                                <View key={dep.id} style={styles.departRow}>
                                    <View style={styles.departIconWrap}>
                                        <MaterialCommunityIcons name="map-marker-radius" size={20} color="#4F46E5" />
                                    </View>
                                    <View>
                                        <Text style={styles.departCity}>{dep.ville}</Text>
                                        <Text style={styles.departCountry}>{dep.pays}</Text>
                                    </View>
                                </View>
                            ))}
                            <View style={styles.divider} />
                        </>
                    )}

                    {/* Includes */}
                    {template.includes && template.includes.length > 0 && (
                        <>
                            <SectionHeader icon="playlist-check" title="What's Included" />
                            <View style={styles.includesGrid}>
                                {template.includes.map((inc, i) => {
                                    const colors = getIncludeColor(inc.type);
                                    return (
                                        <View key={i} style={[styles.includeItem, { backgroundColor: colors.bg }]}>
                                            <View style={[styles.includeIconWrap, { backgroundColor: `${colors.icon}22` }]}>
                                                <MaterialCommunityIcons
                                                    name={getIncludeIcon(inc.type)}
                                                    size={18}
                                                    color={colors.icon}
                                                />
                                            </View>
                                            <Text style={[styles.includeText, { color: colors.text }]} numberOfLines={2}>
                                                {inc.value}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                            <View style={styles.divider} />
                        </>
                    )}

                    {/* Itinerary */}
                    {template.destination && template.destination.length > 0 && (
                        <>
                            <SectionHeader icon="map-marker-path" title="Itinerary" />
                            <ItineraryTimeline destinations={template.destination} router={router} />
                        </>
                    )}
                </View>
            </Animated.ScrollView>

            {/* Bottom CTA Bar */}
            <View style={styles.ctaBar}>
                <View>
                    <Text style={styles.ctaLabel}>Ready to explore?</Text>
                    <Text style={styles.ctaCity}>
                        {template.destination?.[0]?.location?.ville ?? "Discover"} →{" "}
                        {template.destination?.[template.destination.length - 1]?.location?.ville ?? ""}
                    </Text>
                </View>
                <Pressable style={styles.ctaBtn}>
                    <MaterialCommunityIcons name="calendar-check" size={18} color="#FFF" />
                    <Text style={styles.ctaBtnText}>Book This Trip</Text>
                </Pressable>
            </View>
        </View>
    );
}

// ─────────────────────────────────────────────
// Section Header
// ─────────────────────────────────────────────
function SectionHeader({
    icon,
    title,
}: {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    title: string;
}) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
                <MaterialCommunityIcons name={icon} size={18} color="#4F46E5" />
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
}

// ─────────────────────────────────────────────
// Hero Carousel
// ─────────────────────────────────────────────
function HeroCarousel({
    files,
    type,
    scrollY,
}: {
    files: TripFile[];
    type?: string;
    scrollY: Animated.Value;
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const typeConfig = getTripTypeConfig(type);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems[0]?.index != null) setActiveIndex(viewableItems[0].index);
        },
        []
    );
    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    // Parallax effect on the hero
    const translateY = scrollY.interpolate({
        inputRange: [0, HERO_HEIGHT],
        outputRange: [0, -HERO_HEIGHT * 0.4],
        extrapolate: "clamp",
    });

    return (
        <Animated.View style={[styles.heroContainer, { transform: [{ translateY }] }]}>
            {files.length > 0 ? (
                <FlatList
                    data={files}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, i) => item.id ?? `img-${i}`}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item.link }}
                            style={{ width: SCREEN_WIDTH, height: HERO_HEIGHT }}
                            resizeMode="cover"
                        />
                    )}
                />
            ) : (
                <View style={styles.heroFallback}>
                    <MaterialCommunityIcons name="image-off-outline" size={48} color="rgba(255,255,255,0.4)" />
                </View>
            )}

            {/* Gradient Overlay */}
            <LinearGradient
                colors={["rgba(0,0,0,0.55)", "transparent", "transparent", "rgba(0,0,0,0.6)"]}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
            />

            {/* Type Badge */}
            <View style={styles.typeBadge}>
                <MaterialCommunityIcons name={typeConfig.icon} size={13} color="#FFF" />
                <Text style={styles.typeBadgeText}>{typeConfig.label}</Text>
            </View>

            {/* Dots */}
            {files.length > 1 && (
                <View style={styles.dotsRow}>
                    {files.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                activeIndex === i ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>
            )}

            {/* Image counter */}
            {files.length > 1 && (
                <View style={styles.imageCounter}>
                    <Text style={styles.imageCounterText}>{activeIndex + 1} / {files.length}</Text>
                </View>
            )}
        </Animated.View>
    );
}

// ─────────────────────────────────────────────
// Itinerary Timeline
// ─────────────────────────────────────────────
function ItineraryTimeline({
    destinations,
    router,
}: {
    destinations: DetailedDestination[];
    router: ReturnType<typeof useRouter>;
}) {
    return (
        <View style={styles.timeline}>
            {/* Vertical line */}
            <View style={styles.timelineLine} />

            {destinations.map((dest, i) => {
                const days = getDurationDays(dest.date_start, dest.date_end);
                const isLast = i === destinations.length - 1;

                return (
                    <View key={dest.id ?? i} style={[styles.timelineItem, isLast && { marginBottom: 0 }]}>
                        {/* Node */}
                        <View style={styles.timelineNodeWrap}>
                            <LinearGradient
                                colors={["#6366F1", "#4F46E5"]}
                                style={styles.timelineNode}
                            >
                                <Text style={styles.timelineNodeText}>{i + 1}</Text>
                            </LinearGradient>
                        </View>

                        {/* Content Card */}
                        <View style={styles.timelineCard}>
                            {/* Header */}
                            <View style={styles.timelineCardHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.timelineCity}>
                                        {dest.location?.ville}
                                        {dest.location?.pays ? `, ${dest.location.pays}` : ""}
                                    </Text>
                                    <View style={styles.timelineDateRow}>
                                        <MaterialCommunityIcons name="calendar-range-outline" size={12} color="#6366F1" />
                                        <Text style={styles.timelineDate}>
                                            {dayjs(dest.date_start).format("DD MMM")} → {dayjs(dest.date_end).format("DD MMM YYYY")}
                                        </Text>
                                    </View>
                                </View>
                                {days != null && (
                                    <View style={styles.daysBadge}>
                                        <Text style={styles.daysBadgeText}>{days}d</Text>
                                    </View>
                                )}
                            </View>

                            {/* Description */}
                            {dest.description && (
                                <Text style={styles.timelineDesc}>{dest.description}</Text>
                            )}

                            {/* Destination photos strip */}
                            {dest.files_destination && dest.files_destination.length > 0 && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.destPhotosScroll}
                                    contentContainerStyle={{ gap: 8 }}
                                >
                                    {dest.files_destination.map((f, fi) => (
                                        <View key={fi} style={styles.destPhotoWrap}>
                                            <Image
                                                source={{ uri: f.link }}
                                                style={styles.destPhoto}
                                                resizeMode="cover"
                                            />
                                            {f.favorite && (
                                                <View style={styles.favBadge}>
                                                    <MaterialCommunityIcons name="star" size={9} color="#F59E0B" />
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </ScrollView>
                            )}

                            {/* Accommodations */}
                            {dest.hebergement && dest.hebergement.length > 0 && (
                                <View style={styles.hebSection}>
                                    <View style={styles.hebHeader}>
                                        <MaterialCommunityIcons name="bed-outline" size={13} color="#64748B" />
                                        <Text style={styles.hebHeaderText}>Where You'll Stay</Text>
                                    </View>

                                    {dest.hebergement.map((heb, hi) => {
                                        const hData = heb.hebergement_data;
                                        return (
                                            <View key={hi} style={styles.hebCard}>
                                                {/* Hotel photos */}
                                                {hData?.files && hData.files.length > 0 && (
                                                    <ScrollView
                                                        horizontal
                                                        showsHorizontalScrollIndicator={false}
                                                        style={{ marginBottom: 10 }}
                                                        contentContainerStyle={{ gap: 6 }}
                                                    >
                                                        {hData.files.map((f, imgIdx) => (
                                                            <Image
                                                                key={imgIdx}
                                                                source={{ uri: f.link }}
                                                                style={styles.hebPhoto}
                                                                resizeMode="cover"
                                                            />
                                                        ))}
                                                    </ScrollView>
                                                )}

                                                <View style={styles.hebInfo}>
                                                    <View style={styles.hebIconWrap}>
                                                        <MaterialCommunityIcons name="home-city" size={16} color="#4F46E5" />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.hebName} numberOfLines={1}>
                                                            {heb.name}
                                                        </Text>
                                                        <Text style={styles.hebType}>{heb.type_hebergement}</Text>
                                                    </View>
                                                    {hData && (
                                                        <Pressable
                                                            style={styles.viewHebBtn}
                                                            onPress={() =>
                                                                router.push(`/accommodation/${hData._id}` as any)
                                                            }
                                                        >
                                                            <Text style={styles.viewHebText}>View</Text>
                                                            <MaterialCommunityIcons name="arrow-right" size={12} color="#4F46E5" />
                                                        </Pressable>
                                                    )}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F8FAFC" },
    scroll: { flex: 1 },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 24,
    },
    loadingBox: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    loadingTitle: {
        fontSize: 18,
        fontFamily: "AppBold",
        color: "#0F172A",
    },
    loadingSubtitle: {
        fontSize: 13,
        fontFamily: "AppMedium",
        color: "#94A3B8",
        marginTop: 6,
        textAlign: "center",
    },
    retryBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4F46E5",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 100,
        marginTop: 20,
        gap: 8,
    },
    retryText: { color: "#FFF", fontFamily: "AppBold", fontSize: 14 },

    // Floating Header
    floatingHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        backgroundColor: "rgba(15,23,42,0.92)",
        paddingTop: 52,
        paddingBottom: 14,
        paddingHorizontal: 60,
        alignItems: "center",
    },
    floatingHeaderTitle: {
        color: "#FFF",
        fontFamily: "AppBold",
        fontSize: 15,
    },

    // Back Btn
    backBtnWrapper: {
        position: "absolute",
        top: 52,
        left: 16,
        zIndex: 30,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },

    // Hero
    heroContainer: {
        height: HERO_HEIGHT,
        backgroundColor: "#1E293B",
        overflow: "hidden",
    },
    heroFallback: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1E293B",
    },
    typeBadge: {
        position: "absolute",
        bottom: 20,
        right: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        gap: 5,
    },
    typeBadgeText: {
        color: "#FFF",
        fontFamily: "AppBold",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    dotsRow: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
    },
    dot: { height: 5, borderRadius: 3 },
    dotActive: { width: 20, backgroundColor: "#FFF" },
    dotInactive: { width: 5, backgroundColor: "rgba(255,255,255,0.45)" },
    imageCounter: {
        position: "absolute",
        top: 58,
        right: 16,
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
    },
    imageCounterText: { color: "#FFF", fontFamily: "AppBold", fontSize: 11 },

    // Card Body
    cardBody: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -28,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 24,
    },
    templateBadgeRow: { flexDirection: "row", marginBottom: 12 },
    templateBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F3FF",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
        gap: 5,
        borderWidth: 1,
        borderColor: "#DDD6FE",
    },
    templateBadgeText: {
        color: "#7C3AED",
        fontFamily: "AppBold",
        fontSize: 10,
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontFamily: "AppBold",
        color: "#0F172A",
        lineHeight: 32,
    },
    metaRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 12,
    },
    metaChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        gap: 5,
    },
    metaText: { color: "#4F46E5", fontFamily: "AppSemiBold", fontSize: 12 },
    categoryRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 12,
    },
    categoryChip: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    categoryText: { color: "#475569", fontFamily: "AppSemiBold", fontSize: 11 },
    divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 20 },

    // Section Header
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 8,
    },
    sectionIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
    },
    sectionTitle: { fontSize: 17, fontFamily: "AppBold", color: "#0F172A" },

    // Description
    descText: {
        fontSize: 14,
        fontFamily: "AppRegular",
        color: "#475569",
        lineHeight: 22,
        marginBottom: 12,
    },
    noteBox: {
        flexDirection: "row",
        backgroundColor: "#FFFBEB",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#FDE68A",
        padding: 12,
        marginBottom: 12,
        gap: 10,
    },
    noteText: {
        flex: 1,
        fontSize: 13,
        fontFamily: "AppMedium",
        color: "#92400E",
        lineHeight: 20,
    },
    noteBold: { fontFamily: "AppBold" },
    keywordsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
    keyword: {
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
    },
    keywordText: { color: "#64748B", fontFamily: "AppSemiBold", fontSize: 11 },

    // Departure
    departRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        padding: 14,
        gap: 12,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    departIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
    },
    departCity: { fontSize: 16, fontFamily: "AppBold", color: "#0F172A" },
    departCountry: { fontSize: 12, fontFamily: "AppMedium", color: "#64748B", marginTop: 2 },

    // Includes
    includesGrid: { gap: 10 },
    includeItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        padding: 12,
        gap: 12,
    },
    includeIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    includeText: { flex: 1, fontSize: 13, fontFamily: "AppSemiBold", lineHeight: 18 },

    // Timeline
    timeline: { position: "relative", paddingLeft: 2 },
    timelineLine: {
        position: "absolute",
        left: 19,
        top: 16,
        bottom: 24,
        width: 2,
        backgroundColor: "#E0E7FF",
        borderRadius: 1,
    },
    timelineItem: {
        flexDirection: "row",
        marginBottom: 20,
    },
    timelineNodeWrap: {
        width: 40,
        alignItems: "center",
        paddingTop: 2,
        zIndex: 2,
    },
    timelineNode: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 4,
    },
    timelineNodeText: { color: "#FFF", fontFamily: "AppBold", fontSize: 13 },
    timelineCard: {
        flex: 1,
        backgroundColor: "#FAFBFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E0E7FF",
        padding: 14,
        marginLeft: 10,
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    timelineCardHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 6,
    },
    timelineCity: { fontSize: 15, fontFamily: "AppBold", color: "#0F172A" },
    timelineDateRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
    timelineDate: { fontSize: 11, fontFamily: "AppMedium", color: "#6366F1" },
    daysBadge: {
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 100,
    },
    daysBadgeText: { color: "#4F46E5", fontFamily: "AppBold", fontSize: 12 },
    timelineDesc: {
        fontSize: 13,
        fontFamily: "AppRegular",
        color: "#64748B",
        lineHeight: 19,
        marginBottom: 10,
    },

    // Destination photos
    destPhotosScroll: { marginBottom: 12 },
    destPhotoWrap: { position: "relative" },
    destPhoto: {
        width: 80,
        height: 60,
        borderRadius: 10,
        backgroundColor: "#E2E8F0",
    },
    favBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 100,
        padding: 2,
    },

    // Accommodation section
    hebSection: {
        backgroundColor: "#F0F9FF",
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#BAE6FD",
    },
    hebHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
    },
    hebHeaderText: {
        fontSize: 11,
        fontFamily: "AppBold",
        color: "#64748B",
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    hebCard: {
        backgroundColor: "#FFF",
        borderRadius: 14,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#E0F2FE",
    },
    hebPhoto: {
        width: 72,
        height: 52,
        borderRadius: 10,
        backgroundColor: "#E2E8F0",
    },
    hebInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    hebIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
    },
    hebName: { fontSize: 13, fontFamily: "AppBold", color: "#0F172A" },
    hebType: { fontSize: 11, fontFamily: "AppMedium", color: "#94A3B8", marginTop: 2 },
    viewHebBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 3,
    },
    viewHebText: { color: "#4F46E5", fontFamily: "AppBold", fontSize: 11 },

    // CTA
    ctaBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 12,
    },
    ctaLabel: { fontSize: 11, fontFamily: "AppSemiBold", color: "#94A3B8" },
    ctaCity: { fontSize: 15, fontFamily: "AppBold", color: "#0F172A", marginTop: 2 },
    ctaBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4F46E5",
        paddingHorizontal: 22,
        paddingVertical: 14,
        borderRadius: 100,
        gap: 8,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    ctaBtnText: { color: "#FFF", fontFamily: "AppBold", fontSize: 15 },
});
