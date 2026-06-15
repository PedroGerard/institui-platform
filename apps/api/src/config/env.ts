type NodeEnv = "development" | "test" | "production";

const DEFAULT_DEV_DATABASE_URL = "postgresql://institui:institui@localhost:5432/institui";
const DEFAULT_DEV_CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];
const DEFAULT_ALLOWED_HEADERS = ["Content-Type", "Authorization", "x-association-id", "x-user-id"];
const DEFAULT_ALLOWED_METHODS = ["GET", "POST", "PATCH", "DELETE", "OPTIONS"];

function normalizeNodeEnv(value?: string): NodeEnv {
    if (value === "production" || value === "test") return value;
    return "development";
}

function readCsv(value?: string) {
    return (value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function readPort(value?: string) {
    const port = Number(value || 3333);

    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        throw new Error("PORT deve ser um numero entre 1 e 65535.");
    }

    return port;
}

const nodeEnv = normalizeNodeEnv(process.env.NODE_ENV);
const isProduction = nodeEnv === "production";
const databaseUrl = process.env.DATABASE_URL || (isProduction ? "" : DEFAULT_DEV_DATABASE_URL);

if (!databaseUrl) {
    throw new Error("DATABASE_URL e obrigatoria em producao.");
}

process.env.DATABASE_URL = databaseUrl;

const corsOrigins = readCsv(process.env.CORS_ORIGINS || process.env.CORS_ORIGIN);
const allowedOrigins = corsOrigins.length > 0 ? corsOrigins : (isProduction ? [] : DEFAULT_DEV_CORS_ORIGINS);
const corsMethods = readCsv(process.env.CORS_METHODS);
const corsHeaders = readCsv(process.env.CORS_HEADERS);

export const env = {
    nodeEnv,
    isProduction,
    databaseUrl,
    port: readPort(process.env.PORT),
    host: process.env.HOST || "0.0.0.0",
    cors: {
        allowedOrigins,
        allowedMethods: corsMethods.length > 0 ? corsMethods : DEFAULT_ALLOWED_METHODS,
        allowedHeaders: corsHeaders.length > 0 ? corsHeaders : DEFAULT_ALLOWED_HEADERS
    }
};

export function isCorsOriginAllowed(origin?: string) {
    if (!origin) return true;
    if (!env.isProduction && env.cors.allowedOrigins.includes("*")) return true;
    return env.cors.allowedOrigins.includes(origin);
}
