import { NotificationTypeEnum } from './notification.type';

export interface INotification{
    id: number;
    title: string;
    description: string;
    type: NotificationTypeEnum;
    createdOn: string;
    periodStart: string;
    periodEnd: string;
    read: boolean;
}
