import useCatStore from '../store/catStore';
import { getThemeColors } from './colors';
import { getTranslation } from '../i18n/translations';

/**
 * Uygulamanın aktif temasını (Açık/Koyu) ve dilini (TR/EN) sağlayan merkezi kanca.
 */
export function useAppTheme() {
  const theme = useCatStore((state) => state.theme || 'light');
  const language = useCatStore((state) => state.language || 'tr');
  const toggleTheme = useCatStore((state) => state.toggleTheme);
  const setTheme = useCatStore((state) => state.setTheme);
  const toggleLanguage = useCatStore((state) => state.toggleLanguage);
  const setLanguage = useCatStore((state) => state.setLanguage);

  const colors = getThemeColors(theme);
  const isDark = theme === 'dark';
  const t = getTranslation(language);

  return {
    theme,
    isDark,
    colors,
    toggleTheme,
    setTheme,
    language,
    toggleLanguage,
    setLanguage,
    t,
  };
}

export default useAppTheme;
