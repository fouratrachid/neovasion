import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type AccommodationFilterBarProps = {
    availableTypes: string[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
};

const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('hôtel') || t.includes('hotel')) return 'office-building';
    if (t.includes('appartement')) return 'city';
    if (t.includes('maison')) return 'home-heart';
    if (t.includes('eco')) return 'leaf';
    if (t === 'all') return 'ballot-outline';
    return 'bed';
};

export default function AccommodationFilterBar({
    availableTypes,
    activeFilter,
    onFilterChange,
}: AccommodationFilterBarProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4 pb-2"
        >
            {availableTypes.map((type) => {
                const isActive = activeFilter === type;
                const icon = getIconForType(type) as any;
                const label = type === 'all' ? 'All' : type;

                return (
                    <Pressable
                        key={type}
                        onPress={() => onFilterChange(type)}
                        className="mr-2"
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 50,
                                borderWidth: 1.5,
                                borderColor: isActive ? "#059669" : "#E2E8F0",
                                backgroundColor: isActive ? "#ECFDF5" : "#FFFFFF",
                            }}
                        >
                            <MaterialCommunityIcons
                                name={icon}
                                size={16}
                                color={isActive ? "#059669" : "#64748B"}
                            />
                            <Text
                                style={{
                                    marginLeft: 6,
                                    fontSize: 13,
                                    fontFamily: isActive ? "AppBold" : "AppSemiBold",
                                    color: isActive ? "#059669" : "#475569",
                                }}
                            >
                                {label}
                            </Text>
                        </View>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}
