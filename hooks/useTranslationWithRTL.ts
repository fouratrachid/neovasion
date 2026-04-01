import { useTranslation } from 'react-i18next';
import { useI18nContext } from '../contexts/I18nContext';

export const useTranslationWithRTL = () => {
  const { t, i18n } = useTranslation();
  const { isRTL, currentLanguage } = useI18nContext();

  return {
    t,
    i18n,
    isRTL,
    currentLanguage,
    isCurrentLanguageRTL: isRTL,
  };
};
