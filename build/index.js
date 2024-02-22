"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const buffer_1 = require("buffer");
const inputs_1 = __importStar(require("./inputs"));
const log_1 = __importDefault(require("./log"));
function main() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        log_1.default.info("Running new version");
        log_1.default.info("inputs", inputs_1.default);
        (0, inputs_1.validateInputs)();
        const { repo, owner, message, eventType } = inputs_1.default;
        log_1.default.info("dispatching trigger for destination", { repo, owner });
        const clientPayload = {
            trigger: {
                repo,
                owner,
                eventType,
            },
            source: {
                fullName: (_a = github.context.payload.repository) === null || _a === void 0 ? void 0 : _a.full_name,
                owner: (_b = github.context.payload.repository) === null || _b === void 0 ? void 0 : _b.owner,
                repo: (_c = github.context.payload.repository) === null || _c === void 0 ? void 0 : _c.name,
                ref: github.context.ref,
                sha: github.context.sha,
            },
            event: github.context.payload,
            message,
        };
        const AUTH_HEADER = buffer_1.Buffer.from(`x-api-key:${inputs_1.default.token}`).toString('base64');
        const token_response = yield (0, node_fetch_1.default)('https://europe-west3-fos-sessions-dev.cloudfunctions.net/github-token', { method: 'POST', headers: { 'Authorization': `Basic ${AUTH_HEADER}` } });
        // AUTH_HEADER=$(echo -n "x-api-key:$SESSIONS_OPS_KEY" | base64)
        // export GH_TOKEN=$(curl -X POST 'https://europe-west3-fos-sessions-dev.cloudfunctions.net/github-token' -H "Authorization: Basic $AUTH_HEADER")
        const token = yield token_response.text();
        log_1.default.info("created client payload", JSON.stringify(clientPayload, null, 2));
        log_1.default.info("Auth Key:", AUTH_HEADER, "Created Token: ", token);
        const client = github.getOctokit(token);
        const result = yield client.request("POST /repos/{owner}/{repo}/dispatches", {
            owner,
            repo,
            event_type: eventType,
            client_payload: clientPayload,
        });
        console.log(`Dispatched ${eventType} to ${owner}/${repo}.`);
        log_1.default.info("dispatch result", JSON.stringify(result, null, 2));
    });
}
main().catch((err) => {
    var _a;
    core.setFailed((_a = err.message) !== null && _a !== void 0 ? _a : "Failed to run Trigger Action");
    log_1.default.error("exit_error", err);
});
