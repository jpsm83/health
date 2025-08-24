import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const locale = useLocale();
  const t = useTranslations('footer');

  return (
    <footer className="bg-pink-600 text-white shadow-lg">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Link href={`/${locale}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Heart size={24} className="text-pink-200" />
              <span className="text-xl font-bold">{t('brandName')}</span>
            </Link>
            <p className="text-pink-100 text-sm text-center md:text-left max-w-xs">
              {t('brandDescription')}
            </p>
          </div>

          {/* Quick links section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold text-pink-200">{t('quickLinks')}</h3>
            <div className="flex flex-col space-y-2">
              <Link 
                href="#" 
                className="text-pink-100 hover:text-white transition-colors duration-200 text-sm"
              >
                {t('aboutUs')}
              </Link>
              <Link 
                href="#" 
                className="text-pink-100 hover:text-white transition-colors duration-200 text-sm"
              >
                {t('contact')}
              </Link>
              <Link 
                href="#" 
                className="text-pink-100 hover:text-white transition-colors duration-200 text-sm"
              >
                {t('privacyPolicy')}
              </Link>
            </div>
          </div>

          {/* Contact info section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold text-pink-200">{t('getInTouch')}</h3>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-pink-100 text-sm">
                <Mail size={16} className="text-pink-200" />
                <span>{t('email')}</span>
              </div>
              <div className="flex items-center space-x-2 text-pink-100 text-sm">
                <Phone size={16} className="text-pink-200" />
                <span>{t('phone')}</span>
              </div>
              <div className="flex items-center space-x-2 text-pink-100 text-sm">
                <MapPin size={16} className="text-pink-200" />
                <span>{t('address')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer bar */}
      <div className="bg-pink-700 border-t border-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-pink-200 text-sm text-center md:text-left">
              {t('copyright')}
            </p>
            <div className="flex space-x-6 text-sm">
              <Link 
                href="#" 
                className="text-pink-200 hover:text-white transition-colors duration-200"
              >
                {t('termsOfService')}
              </Link>
              <Link 
                href="#" 
                className="text-pink-200 hover:text-white transition-colors duration-200"
              >
                {t('cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
