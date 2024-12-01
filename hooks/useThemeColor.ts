import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useSettings } from '@/components/Settings/Context';

export function useThemeColors() {
    const { colorTheme } = useSettings()
    const deviceColorScheme = useColorScheme();
    const theme = (colorTheme === "system" ? deviceColorScheme : colorTheme) ?? 'light';
    return Colors[theme];
}
