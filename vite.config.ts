/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// @ts-ignore
const root = resolve(__dirname, "src");

export default defineConfig({
    base: "./",
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(root, ""),
        },
    },
    server: {
        port: 3000,
    },
});

