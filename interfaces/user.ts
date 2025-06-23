import { Types } from 'mongoose';

export interface ICategoryInterest {
  _id?: Types.ObjectId;
  type: string;
  newsletterSubscription?: boolean;
  subscriptionFrequencies?: string;
}

export interface IUserPreferences {
  language: string;
  region: string;
  contentLanguage: string;
}

export interface IReadingHistoryItem {
  newsId: Types.ObjectId;
  readAt?: Date;
}

export interface IUser {
  _id?: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  birthDate: Date;
  imageFile?: string;
  imageUrl?: string;
  preferences: IUserPreferences;
  likedNews?: Types.ObjectId[];
  commentedNews?: Types.ObjectId[];
  categoryInterests: ICategoryInterest[];
  readingHistory?: IReadingHistoryItem[];
  lastLogin?: Date;
  isActive?: boolean;
  emailVerified?: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
} 