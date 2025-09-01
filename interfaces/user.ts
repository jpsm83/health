import { Types } from 'mongoose';

export interface IUserPreferences {
  language: string;
  region: string;
}

export interface ISubscriptionPreferences {
  categories: string[];
  subscriptionFrequencies: string;
}

export interface IReadingHistoryItem {
  articlesId: Types.ObjectId;
  readAt?: Date;
}

export interface IUser {
  _id?: Types.ObjectId | string;
  username: string;
  email: string;
  password: string;
  role: string;
  birthDate: Date;
  imageFile?: string;
  imageUrl?: string;
  preferences: IUserPreferences;
  likedArticles?: Types.ObjectId[];
  commentedArticles?: Types.ObjectId[];
  subscriptionPreferences: ISubscriptionPreferences;
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