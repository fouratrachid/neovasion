export interface SendOtpRequest {
    email: string;
    FirstName?: string;
    LastName?: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface User {
    _id: string;
    FirstName: string;
    LastName: string;
    email: string;
    role: 'SuperAdmin' | 'CompanyAdmin' | 'EventManager' | 'Attendee';
    status: 'active' | 'inactive' | 'deleted';
    companyId?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export interface AuthResponse {
    success: boolean;
    data?: {
        token?: string;
        user?: User;
    };
    message?: string;
}

export interface LoginRequest {
    email: string;
    password?: string;
    lang?: string;
}




export interface EventAvailability {
    currentAttendees: number;
    limit: number;
    spotsAvailable: number;
    isFull: boolean;
}

export interface ConferenceRoom {
    _id: string;
    name: string;
    description?: string;
    livekitRoomName: string;
    maxParticipants?: number;
    currentParticipants?: number;
    isActive: boolean;
}

export interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    type: 'public' | 'private';
    availability?: EventAvailability;
    image?: string;
    status?: string;
    tags?: string[];
    companyId?: {
        _id: string;
        name: string;
    };
    info?: string;
    attendees?: string[];
    hosts?: any[];
    conferenceRooms?: ConferenceRoom[];
}

export interface Activity {
    starttime: string;
    endtime: string;
    activity: string;
    speaker?: string;
}

export interface PlanningDay {
    dayrank: number;
    date: string;
    title: string;
    description?: string;
    mainFocus?: string[];
    activities?: Activity[];
}

export interface EventPlanningResponse {
    success: boolean;
    planningDays?: PlanningDay[];
    message?: string;
}

export interface AddPlanningDaysRequest {
    planningDays: PlanningDay[];
}

export interface UpdatePlanningDayRequest {
    date?: string;
    title?: string;
    description?: string;
    mainFocus?: string[];
    activities?: Activity[];
}

// Stand Templates
export interface StandTemplateContent {
    label: string;
    description: string;
}

export interface StandTemplate {
    _id: string;
    name: string;
    description: string;
    htmlContent: string;
    isActive: boolean;
    contents: StandTemplateContent[];
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateStandTemplateRequest {
    name?: string;
    description?: string;
    htmlContent?: string;
    isActive?: boolean;
    contents?: StandTemplateContent[];
}

export interface StandTemplatesResponse {
    success: boolean;
    data?: {
        standTemplates: StandTemplate[];
    };
    message?: string;
}

export interface StandTemplateResponse {
    success: boolean;
    data?: {
        standTemplate: StandTemplate;
    };
    message?: string;
}

// Panier (Shopping Cart)
export interface PanierItem {
    _id: string;
    EventId: string;
    offerId: string;
    addedAt?: string;
}

export interface Panier {
    _id: string;
    userId: string;
    items: PanierItem[];
    status: 'active' | 'abandoned' | 'sent';
    createdAt?: string;
    updatedAt?: string;
}

export interface AddPanierItemRequest {
    EventId: string;
    offerId: string;
}

export interface PaniersResponse {
    success: boolean;
    data?: {
        paniers: Panier[];
    };
    message?: string;
}

export interface PanierResponse {
    success: boolean;
    data?: {
        panier: Panier;
    };
    message?: string;
}

export interface SendPanierToATSResponse {
    success: boolean;
    message?: string;
    atsToken?: string;
    data?: {
        dossier?: any;
        message?: string;
    };
}

// Sponsors
export interface SponsorOffre {
    atsId: string;
}

export interface JobOffer {
    _id: string;
    title: string;
    description?: string;
    requirements?: string[];
    responsibilities?: string[];
    qualifications?: string[];
    benefits?: string[];
    location?: string;
    type?: string;
    salary?: string;
    department?: string;
    postedDate?: string;
    closingDate?: string;
    status?: string;
}

export interface JobOffersDetailsResponse {
    success: boolean;
    message?: string;
    data?: {
        offers: JobOffer[];
    };
}

export interface SponsorContent {
    label: string;
    description: string;
    path: string;
}

export interface SponsorIdDetails {
    _id: string;
    name: string;
    description: string;
    logo: string;
    contactEmail?: string;
    website?: string;
}

export interface StandManager {
    _id: string;
    FirstName: string;
    LastName: string;
    email: string;
}

export interface Sponsor {
    sponsorId: SponsorIdDetails | string;
    name: string;
    description: string;
    logo: string;
    sponsorshipLevel: 'platinum' | 'gold' | 'silver' | 'bronze';
    standTemplateId?: string;
    htmlContent?: string;
    imageContent?: string | null;
    content?: SponsorContent[];
    offres?: SponsorOffre[];
    StandManagers?: StandManager[];
    createdAt?: string;
    updatedAt?: string;
}

export interface SponsorsResponse {
    success: boolean;
    data?: {
        sponsors: Sponsor[];
    };
    message?: string;
}

export interface SponsorResponse {
    success: boolean;
    data?: {
        sponsor: Sponsor;
    };
    message?: string;
}

// ATS Integration Types
export interface ATSUser {
    _id: string;
    FirstName: string;
    LastName: string;
    email: string;
    atsId?: string;
}

export interface ATSLinkResponse {
    success: boolean;
    message: string;
    data: {
        user: ATSUser;
    };
}

export interface ATSUnlinkResponse {
    success: boolean;
    message: string;
    data: {
        user: ATSUser;
    };
}

export interface ATSSyncRequest {
    atsId: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface ATSSyncResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        isNewUser: boolean;
    };
}

// ============================================
// Stand Chat Types
// ============================================

export interface StandChatMessage {
    _id: string;
    senderId: {
        _id: string;
        FirstName?: string;
        LastName?: string;
        email?: string;
    };
    content: string;
    timestamp: string;
    isRead: boolean;
    readAt?: string;
}

export interface StandChat {
    _id: string;
    eventId: {
        _id: string;
        title?: string;
        image?: string;
    };
    sponsorId: {
        _id: string;
        name?: string;
        logo?: string;
    };
    attendeeId: {
        _id: string;
        FirstName?: string;
        LastName?: string;
        email?: string;
        avatar?: string;
    };
    standManagerId: {
        _id: string;
        FirstName?: string;
        LastName?: string;
        email?: string;
        avatar?: string;
    };
    messages: StandChatMessage[];
    lastMessageAt: string;
    status: string;
    unreadCount: number;
    online?: boolean;
}

export interface StandChatResponse {
    success: boolean;
    data: {
        chat: StandChat;
    };
    message?: string;
}

export interface StandChatsListResponse {
    success: boolean;
    data: {
        chats: StandChat[];
        total: number;
    };
    message?: string;
}

export interface SendStandMessageRequest {
    content: string;
    attachment?: any;
}

export interface SendStandMessageResponse {
    success: boolean;
    data: {
        message: StandChatMessage;
        chat: StandChat;
    };
    message?: string;
}

export interface MarkStandChatReadResponse {
    success: boolean;
    data: {
        chat: StandChat;
    };
    message?: string;
}

// Notification types
export interface Notification {
    _id: string;
    title?: string; // Optional - may not be present in API response
    message: string; // Required - always present in API response
    body?: string;
    type: 'event' | 'message' | 'system' | 'update' | 'invitation' | 'reminder';
    read?: boolean; // Optional - may not be present, use isSeen as fallback
    isSeen: boolean;
    createdAt: string;
    metadata?: Record<string, any>;
    context?: Record<string, any>; // API returns context instead of metadata
    recipientId?: string;
    doneBy?: string;
    __v?: number;
}

export interface GetNotificationsResponse {
    success: boolean;
    data?: Notification[];
    message?: string;
}

export interface GetNotificationResponse {
    success: boolean;
    data?: Notification;
    message?: string;
}

export interface MarkNotificationReadResponse {
    success: boolean;
    message?: string;
}

export interface DeleteNotificationResponse {
    success: boolean;
    message?: string;
}