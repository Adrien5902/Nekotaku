import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useSettings } from '@/components/Settings/Context';

export function useThemeColors() {
    const { colorTheme } = useSettings()
    const theme = (colorTheme === "system" ? useColorScheme() : colorTheme) ?? 'light';
    return Colors[theme];
}
