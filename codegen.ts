
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: "https://graphql.anilist.co",
    documents: ['./{app,components,hooks,types}/**/*.{ts,tsx}'],
    generates: {
        "./types/Anilist/": {
            preset: "client",
            presetConfig: {
                gqlTagName: "gql"
            }
        }
    }
};

export default config;
