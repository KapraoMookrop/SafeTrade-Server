export interface NotificationData {
    Id: string;
    UserId: string;
    Type: number;
    Title: string;
    Message: string;
    RelatedId: string;
    CreatedAt: Date;
    IsRead: boolean;
}