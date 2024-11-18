
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: "https://graphql.anilist.co",
    generates: {
        "./types/Anilist/": {
            plugins: ["typescript"],
            preset: "client",
            presetConfig: {
                gqlTagName: "./gql"
            }
        }
    }
};

export default config;
