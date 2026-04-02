import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TripTypeFilter } from "./types";

type FilterOption = {
    key: TripTypeFilter;
    label: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

const FILTERS: FilterOption[] = [
    { key: "all", label: "All", icon: "compass-outline" },
    { key: "city", label: "City", icon: "city-variant-outline" },
    { key: "beach", label: "Beach", icon: "beach" },
    { key: "adventure", label: "Adventure", icon: "hiking" },
    { key: "nature", label: "Nature", icon: "tree-outline" },
];

type TripTypeFilterBarProps = {
    activeFilter: TripTypeFilter;
    onFilterChange: (filter: TripTypeFilter) => void;
};

export default function TripTypeFilterBar({
    activeFilter,
    onFilterChange,
}: TripTypeFilterBarProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4 pb-2"
        >
            {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                    <Pressable
                        key={filter.key}
                        onPress={() => onFilterChange(filter.key)}
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
                                borderColor: isActive ? "#2563EB" : "#E2E8F0",
                                backgroundColor: isActive ? "#EFF6FF" : "#FFFFFF",
                            }}
                        >
                            <MaterialCommunityIcons
                                name={filter.icon}
                                size={16}
                                color={isActive ? "#2563EB" : "#64748B"}
                            />
                            <Text
                                style={{
                                    marginLeft: 6,
                                    fontSize: 13,
                                    fontFamily: isActive ? "AppBold" : "AppSemiBold",
                                    color: isActive ? "#2563EB" : "#475569",
                                }}
                            >
                                {filter.label}
                            </Text>
                        </View>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}
