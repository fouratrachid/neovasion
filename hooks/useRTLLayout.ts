import { useI18nContext } from '@/contexts/I18nContext';
import type { LayoutStyles } from '@/interfaces/context';
import { useMemo } from 'react';

interface UseRTLLayoutReturn {
  isRTL: boolean;
  layoutStyles: LayoutStyles;
}

export const useRTLLayout = (): UseRTLLayoutReturn => {
  const { isRTL } = useI18nContext();

  // Debug log to see what value we're getting
  console.log('🔧 useRTLLayout - isRTL:', isRTL);

  const layoutStyles = useMemo<LayoutStyles>(() => ({
    row: { flexDirection: isRTL ? 'row-reverse' : 'row' },
    column: { flexDirection: 'column' },

    textLeft: { textAlign: isRTL ? 'right' : 'left' },
    textRight: { textAlign: isRTL ? 'left' : 'right' },
    textCenter: { textAlign: 'center' },

    marginStart: (value: number) => (isRTL ? { marginRight: value } : { marginLeft: value }),
    marginEnd: (value: number) => (isRTL ? { marginLeft: value } : { marginRight: value }),

    paddingStart: (value: number) => (isRTL ? { paddingRight: value } : { paddingLeft: value }),
    paddingEnd: (value: number) => (isRTL ? { paddingLeft: value } : { paddingRight: value }),

    start: (value: number) => (isRTL ? { right: value } : { left: value }),
    end: (value: number) => (isRTL ? { left: value } : { right: value }),

    flipHorizontal: { transform: [{ scaleX: isRTL ? -1 : 1 }] },
  }), [isRTL]);

  return {
    isRTL,
    layoutStyles,
  };
};