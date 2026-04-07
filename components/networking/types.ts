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
    comments?: NetworkingComment[];
    hoster: NetworkingHoster;
}

export interface NetworkingActivityResponse {
    country: string;
    bounds: NetworkingBounds;
    posts: NetworkingPost[];
}
