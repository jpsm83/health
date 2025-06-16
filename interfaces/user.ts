import { Types } from 'mongoose';
import { 
  genders, 
  mainCategories, 
  newsletterFrequencies, 
  roles 
} from '@/lib/constants';

export interface ICategoryInterest {
  type: typeof mainCategories;
  newsletterSubscription?: boolean;
  subscriptionFrequencies?: typeof newsletterFrequencies;
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
  roles: typeof roles;
  gender: typeof genders;
  birthDate: Date;
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