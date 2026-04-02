export const formatDate = (value?: string) => {
    if (!value) return "Date to be confirmed";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date to be confirmed";
    return date.toLocaleDateString();
};

export const getInitials = (first?: string, last?: string) => {
    const firstLetter = first?.trim().charAt(0).toUpperCase() ?? "";
    const lastLetter = last?.trim().charAt(0).toUpperCase() ?? "";
    const result = `${firstLetter}${lastLetter}`.trim();
    return result || "TR";
};
