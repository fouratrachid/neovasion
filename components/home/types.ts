export type HomeFile = {
    name?: string;
    link?: string;
    urlfile?: string;
};

export type HomeFeature = {
    name: string;
    description?: string;
    status?: boolean;
};

export type Accommodation = {
    _id: string;
    type: string;
    name: string;
    files?: HomeFile[];
    services?: HomeFeature[];
    options?: HomeFeature[];
    is_active?: boolean;
};

export type ProfileLanguage = {
    langue: string;
    level: number;
};

export type Profile = {
    _id: string;
    firstname: string;
    lastname: string;
    uniqueName?: string;
    imageProfile?: string;
    biography?: string;
    speciality?: string[];
    language?: ProfileLanguage[];
    avgRating?: number | null;
    tripCount?: number;
};

export type TripHoster = {
    firstname?: string;
    lastname?: string;
    avgRating?: number;
    imageProfile?: string;
};

export type TripMedia = {
    id?: string;
    link: string;
    favorite?: boolean;
};

export type TripDestination = {
    id?: string;
    location?: {
        pays?: string;
        ville?: string;
    };
    date_start?: string;
    date_end?: string;
};

export type Trip = {
    _id: string;
    title_trip: string;
    desc_trip?: string;
    type_trip?: string;
    categories?: string[];
    date_depart?: string;
    files_trip?: TripMedia[];
    destination?: TripDestination[];
    includes?: { type?: string; value?: string }[];
    hoster?: TripHoster;
    hebergements?: Accommodation[];
    price?: number;
};

export type CountryNearby = {
    _id: string;
    nom: string;
    code: string;
    files?: {
        urlfile?: string;
        name?: string;
        description?: string;
    }[];
};

export type HomeActivityResponse = {
    accomodations: Accommodation[];
    profiles: Profile[];
    trips: Trip[];
    countriesNearby: CountryNearby[];
};

export type HomeStats = {
    trips: number;
    stays: number;
    guides: number;
    countries: number;
};
