export const Colors = {
    light: {
        text: '#483d47',
        background: '#f2eaef',
        primary: '#daced9',
        secondary: '#bbafc0',
        accent: '#FFAC68',
        alert: '#ff0000',
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        primary: "#333333",
        secondary: "#555555",
        accent: '#E38FBF',
        alert: '#ff4f4f',
    },
};

export type Color = keyof typeof Colors.light & keyof typeof Colors.dark;
