export type AccommodationsBounds = {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
};

export type AccommodationFile = {
    name: string;
    link: string;
};

export type AccommodationService = {
    name: string;
    description: string;
    status: boolean;
};

export type AccommodationOption = {
    name: string;
    description: string;
    status: boolean;
    type?: string;
};

export type AccommodationLocation = {
    lon: number;
    lat: number;
};

export type Accommodation = {
    _id: string;
    type: string;
    name: string;
    position: string;
    files: AccommodationFile[];
    services: AccommodationService[];
    options: AccommodationOption[];
    is_active: boolean;
    location: AccommodationLocation;
};

export type AccommodationsResponse = {
    country: string;
    bounds: AccommodationsBounds;
    accomodations: Accommodation[]; // Using backend spelling
};

export type AccommodationFilterType = 'all' | 'Appartement' | 'Maison d\'hôtes' | 'Eco Lodge' | 'Hôtel';
