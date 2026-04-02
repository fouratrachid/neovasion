export type TripFile = {
    id?: string;
    link: string;
    name?: string;
    favorite?: boolean;
};

export type TripInclude = {
    type: string;
    value: string;
};

export type TripDepart = {
    id?: string;
    pays: string;
    ville: string;
    position: string;
};

export type TripDestinationLocation = {
    position: string;
    pays: string;
    ville: string;
};

export type TripDestination = {
    id?: string;
    location: TripDestinationLocation;
    date_start: string;
    date_end: string;
    description?: string;
    files_destination?: TripFile[];
};

export type TripHoster = {
    firstname: string;
    lastname: string;
    imageProfile?: string;
    uniqueName?: string;
    avgRating?: number;
};

export type AccommodationFile = {
    name: string;
    link: string;
};

export type AccommodationService = {
    name: string;
    description?: string;
    status: boolean;
};

export type AccommodationOption = {
    name: string;
    description?: string;
    type?: string;
    status: boolean;
};

export type TripAccommodation = {
    _id: string;
    type: string;
    name: string;
    position?: string;
    files?: AccommodationFile[];
    services?: AccommodationService[];
    options?: AccommodationOption[];
};

export type Trip = {
    _id: string;
    hoster_id: string;
    title_trip: string;
    desc_trip?: string;
    type_trip?: string;
    video_trip?: string;
    mot_cle?: string[];
    includes?: TripInclude[];
    note_special?: string;
    files_trip?: TripFile[];
    date_depart?: string;
    depart?: TripDepart[];
    destination?: TripDestination[];
    categories?: string[];
    hoster?: TripHoster;
    hebergements?: TripAccommodation[];
};

export type TripsBounds = {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
};

export type TripsActivityResponse = {
    country: string;
    bounds: TripsBounds;
    trips: Trip[];
};

export type TripTypeFilter = 'all' | 'city' | 'beach' | 'adventure' | 'nature';
