import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };
let tempDir: string;

function restoreEnv() {
    for (const key of Object.keys(process.env)) {
        delete process.env[key];
    }

    Object.assign(process.env, originalEnv);
}

async function importEnvModule() {
    vi.resetModules();
    return import("../env.js");
}

describe("env config", () => {
    beforeEach(() => {
        restoreEnv();
        tempDir = mkdtempSync(join(tmpdir(), "institui-env-"));
        process.env.INSTITUI_ENV_DIR = tempDir;
        delete process.env.DATABASE_URL;
        delete process.env.CORS_ORIGINS;
        delete process.env.CORS_ORIGIN;
        delete process.env.CORS_METHODS;
        delete process.env.CORS_HEADERS;
        delete process.env.PORT;
        delete process.env.HOST;
    });

    afterEach(() => {
        restoreEnv();
        rmSync(tempDir, { recursive: true, force: true });
        vi.resetModules();
    });

    it("uses safe local defaults outside production", async () => {
        process.env.NODE_ENV = "development";

        const { env, isCorsOriginAllowed } = await importEnvModule();

        expect(env.databaseUrl).toBe("postgresql://institui:institui@localhost:5432/institui");
        expect(env.port).toBe(3333);
        expect(env.host).toBe("0.0.0.0");
        expect(isCorsOriginAllowed("http://localhost:3000")).toBe(true);
        expect(isCorsOriginAllowed("https://example.org")).toBe(false);
    });

    it("loads local .env files without overriding existing process variables", async () => {
        process.env.NODE_ENV = "development";
        process.env.PORT = "4444";
        writeFileSync(
            join(tempDir, ".env"),
            [
                "DATABASE_URL=\"postgresql://local:local@localhost:5432/local\"",
                "PORT=3333",
                "CORS_ORIGINS=\"http://localhost:3001\""
            ].join("\n")
        );

        const { env, isCorsOriginAllowed } = await importEnvModule();

        expect(env.databaseUrl).toBe("postgresql://local:local@localhost:5432/local");
        expect(env.port).toBe(4444);
        expect(isCorsOriginAllowed("http://localhost:3001")).toBe(true);
    });

    it("requires DATABASE_URL in production", async () => {
        process.env.NODE_ENV = "production";
        process.env.CORS_ORIGINS = "https://app.institui.org";

        await expect(importEnvModule()).rejects.toThrow("DATABASE_URL e obrigatoria em producao.");
    });

    it("requires explicit non-wildcard CORS origins in production", async () => {
        process.env.NODE_ENV = "production";
        process.env.DATABASE_URL = "postgresql://prod:prod@db:5432/institui";

        await expect(importEnvModule()).rejects.toThrow("CORS_ORIGINS e obrigatoria em producao.");

        process.env.CORS_ORIGINS = "*";

        await expect(importEnvModule()).rejects.toThrow("CORS_ORIGINS nao pode usar '*' em producao.");
    });
});
