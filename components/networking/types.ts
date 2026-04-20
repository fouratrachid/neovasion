export interface NetworkingBounds {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
}

export interface NetworkingMedia {
    index?: number;
    link: string;
    type: "Image" | "Video" | string;
}

export interface NetworkingHoster {
    firstname: string;
    lastname: string;
    imageProfile?: string;
    uniqueName?: string;
}

export interface NetworkingCommentUser {
    firstName?: string;
    lastName?: string;
    email?: string;
    imageLink?: string;
}

export interface NetworkingComment {
    _id: string;
    message: string;
    dateTime?: string;
    replyTo?: string | null;
    userId?: NetworkingCommentUser;
}

export interface NetworkingPost {
    _id: string;
    nbComment: number;
    media: NetworkingMedia[];
    format: string;
    programed: boolean;
    datePost: string;
    reaction?: string;
    position?: string;
    description?: string;
    Htags?: string[];
    nbLikes?: number;
    is_like?: boolean;
    comments?: NetworkingComment[];
    hoster: NetworkingHoster;
}

export interface NetworkingActivityResponse {
    country: string;
    bounds: NetworkingBounds;
    posts: NetworkingPost[];
}

export interface ProfileMedia {
    _id: string;
    media: string;
    link: string;
}

export interface ProfileLanguage {
    _id: string;
    langue: string;
    level: number;
}

export interface ProfileRating {
    _id: string;
    iduser: string;
    avis: number;
    comment: string;
}

export interface ProfileFile {
    type: string;
    fileId: string;
    fileName: string;
    url: string;
    is_active: boolean;
    is_favorite: boolean;
}

export interface Profile {
    _id: string;
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    socialMedia?: ProfileMedia[];
    language?: ProfileLanguage[];
    speciality?: string[];
    biography?: string;
    about?: string;
    rating?: ProfileRating[] | number;
    grad?: number;
    imageProfile?: string;
    paiementActive?: boolean;
    accountActive?: boolean;
    accountReview?: number;
    uniqueName?: string;
    files?: ProfileFile[];
    avgRating?: number | null;
    maxLangLevel?: number | null;
    tripCount?: number;
    followerCount?: number;
}

export interface ProfilesActivityResponse {
    country: string;
    bounds: NetworkingBounds;
    profiles: Profile[];
}
