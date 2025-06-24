import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/dist", "eslint.config.mjs", "node_modules/**", ".angular"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@angular-eslint/recommended",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        "no-implicit-coercion": "warn",
        "@angular-eslint/directive-selector": ["error", {
            type: "attribute",
            style: "camelCase",
        }],

        "quotes": ["warn", "single", {
            avoidEscape: true,
            allowTemplateLiterals: true,
        }],

        "no-console": ["warn", {
            allow: ["warn", "error"],
        }],

        "no-multiple-empty-lines": ["error", {
            max: 2,
            maxBOF: 1,
        }],

        "no-redeclare": "error",
        "no-plusplus": "warn",
        "max-params": ["error", 10],
        "no-dupe-else-if": "error",
        "no-dupe-keys": "error",
        "no-duplicate-imports": "error",
        "no-unsafe-negation": "error",
        "consistent-return": "error",
        "default-case": "error",
        "logical-assignment-operators": "error",
        "no-array-constructor": "error",
        "array-callback-return": "warn",

        "@typescript-eslint/member-ordering": ["warn", {
            default: {
                memberTypes: [
                    "public-static-field",
                    "protected-static-field",
                    "private-static-field",
                    "public-decorated-field",
                    "public-instance-field",
                    "public-abstract-field",
                    "protected-instance-field",
                    "protected-decorated-field",
                    "protected-abstract-field",
                    "private-instance-field",
                    "private-decorated-field",
                    "static-field",
                    "public-field",
                    "instance-field",
                    "protected-field",
                    "private-field",
                    "abstract-field",
                    "constructor",
                    "public-static-method",
                    "protected-static-method",
                    "private-static-method",
                    "public-method",
                    "protected-method",
                    "private-method",
                ],
            },
        }],

        "@typescript-eslint/naming-convention": ["warn", {
            selector: "variable",
            format: ["camelCase"],
        }, {
            selector: "interface",
            format: ["PascalCase"],

            custom: {
                regex: "^I[A-Z]",
                match: true,
            },
        }, {
            selector: "enum",
            format: ["PascalCase"],

            custom: {
                regex: "^([A-Z][a-zA-Z0-9]*)+Enum$",
                match: true,
            },
        }],

        "@angular-eslint/no-output-native": "warn",
        eqeqeq: "error",
        "prefer-const": "error",
        "no-prototype-builtins": "warn",
        semi: "error",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-inferrable-types": 0,
        "@angular-eslint/no-empty-lifecycle-method": ["warn"],

        "max-lines-per-function": ["error", {
            max: 75,
            skipComments: true,
        }],

        "max-lines": ["error", {
            max: 700,
            skipComments: true,
        }],

        "@typescript-eslint/explicit-function-return-type": "error",
        "no-var": "error",
        indent: ["warn", 2],
        "no-useless-escape": "warn",
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/no-explicit-any": ["warn"],
    },
}, {
    files: ["**/*.spec.ts"],

    rules: {
        "max-lines-per-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
}];