/**
 * Query Key Factory - Centralized management of query keys
 * This ensures consistency across the app and makes invalidation easier
 */

export const queryKeys = {
    // Home activity
    home: {
        all: ["home"],
        activity: () => [...queryKeys.home.all, "activity"],
    },

    // Accommodations
    accommodations: {
        all: ["accommodations"],
        list: () => [...queryKeys.accommodations.all, "list"],
        detail: (id: string) => [...queryKeys.accommodations.all, "detail", id],
    },

    // Trips
    trips: {
        all: ["trips"],
        list: () => [...queryKeys.trips.all, "list"],
        detail: (id: string) => [...queryKeys.trips.all, "detail", id],
        templates: () => [...queryKeys.trips.all, "templates"],
        templateDetail: (id: string) => [...queryKeys.trips.all, "template", id],
    },

    // Networking
    networking: {
        all: ["networking"],
        activity: () => [...queryKeys.networking.all, "activity"],
    },

    // Authentication
    auth: {
        all: ["auth"],
        profile: () => [...queryKeys.auth.all, "profile"],
        me: () => [...queryKeys.auth.all, "me"],
    },
};
