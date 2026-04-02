import { MaterialCommunityIcons } from "@expo/vector-icons";

export const formatTripDate = (value?: string): string => {
    if (!value) return "TBD";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const formatShortDate = (value?: string): string => {
    if (!value) return "TBD";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export const getDurationDays = (start?: string, end?: string): number | null => {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getInitials = (first?: string, last?: string): string => {
    const firstLetter = first?.trim().charAt(0).toUpperCase() ?? "";
    const lastLetter = last?.trim().charAt(0).toUpperCase() ?? "";
    const result = `${firstLetter}${lastLetter}`.trim();
    return result || "TR";
};

type TripTypeConfig = {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    color: string;
    bgColor: string;
    label: string;
};

export const getTripTypeConfig = (type?: string): TripTypeConfig => {
    switch (type?.toLowerCase()) {
        case "city":
            return {
                icon: "city-variant-outline",
                color: "#7C3AED",
                bgColor: "#F3E8FF",
                label: "City",
            };
        case "beach":
            return {
                icon: "beach",
                color: "#0891B2",
                bgColor: "#E0F7FA",
                label: "Beach",
            };
        case "adventure":
            return {
                icon: "hiking",
                color: "#EA580C",
                bgColor: "#FFF7ED",
                label: "Adventure",
            };
        case "nature":
            return {
                icon: "tree-outline",
                color: "#16A34A",
                bgColor: "#F0FDF4",
                label: "Nature",
            };
        default:
            return {
                icon: "airplane-takeoff",
                color: "#2563EB",
                bgColor: "#EFF6FF",
                label: type ? type.charAt(0).toUpperCase() + type.slice(1) : "Trip",
            };
    }
};

export const renderStars = (rating?: number): string => {
    const r = Math.round(rating ?? 0);
    const filled = Math.min(r, 5);
    const empty = 5 - filled;
    return "★".repeat(filled) + "☆".repeat(empty);
};
