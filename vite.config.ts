import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ResolvedConfig } from "vite";
import { AssetPack, type AssetPackConfig } from "@assetpack/core";
import { msdfFont } from "@assetpack/core/webfont";

function assetpackPlugin(): Plugin {
    const apConfig: AssetPackConfig = {
        entry: "./raw-assets",
        cache: false,
        pipes: [msdfFont()],
    };
    let mode: ResolvedConfig["command"];
    let ap: AssetPack | undefined;

    return {
        name: "vite-plugin-assetpack",
        configResolved(resolvedConfig) {
            mode = resolvedConfig.command;
            if (!resolvedConfig.publicDir) return;
            if (apConfig.output) return;
            const publicDir = resolvedConfig.publicDir.replace(
                process.cwd(),
                "",
            );
            apConfig.output = `.${publicDir}/assets/`;
        },
        buildStart: async () => {
            if (mode === "serve") {
                if (ap) return;
                ap = new AssetPack(apConfig);
                void ap.watch();
            } else {
                await new AssetPack(apConfig).run();
            }
        },
        buildEnd: async () => {
            if (ap) {
                await ap.stop();
                ap = undefined;
            }
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), assetpackPlugin()],
});
