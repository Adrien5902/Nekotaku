import 'ts-node/register'; // Add this to import TypeScript files
import type { ExpoConfig } from 'expo/config';
import { version, name, displayName, description } from './package.json';

const config: ExpoConfig = {
    name: displayName,
    slug: displayName,
    owner: "adrien5902",
    description,
    version,
    icon: "./assets/app-icons/icon.png",
    scheme: name,
    userInterfaceStyle: "automatic",
    githubUrl: "https://github.com/Adrien5902/Nekotaku",
    backgroundColor: "#151718",
    primaryColor: "#e38fbf",
    splash: {
        image: "./assets/app-icons/splash.png",
        resizeMode: "contain",
        backgroundColor: "#151718"
    },
    androidStatusBar: {
        barStyle: "light-content",
        translucent: true
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: `net.ddns.adrien5902.${name}`
    },
    notification: {
        icon: "./assets/app-icons/icon-notifications.png",
        color: "#e38fbf"
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/app-icons/icon-foreground.png",
            monochromeImage: "./assets/app-icons/icon-monochrome.png",
            backgroundColor: "#151718"
        },
        package: `net.ddns.adrien5902.${name}`
    },
    web: {
        bundler: "metro",
        output: "static",
        icon: "./assets/app-icons/icon.png"
    },
    plugins: [
        "expo-router",
        "expo-video",
        "expo-build-properties",
        "expo-secure-store",
        "react-native-google-cast"
    ],
    experiments: {
        typedRoutes: true
    },
    extra: {
        eas: {
            projectId: "d073d778-dde5-4cc0-904f-644fefd1c7d3"
        }
    },
    runtimeVersion: {
        policy: "appVersion"
    },
    updates: {
        requestHeaders: {
            "expo-channel-name": "preview"
        },
        url: "https://u.expo.dev/d073d778-dde5-4cc0-904f-644fefd1c7d3",
        checkAutomatically: 'ON_LOAD',
        enabled: true,
    }
}

export default config;