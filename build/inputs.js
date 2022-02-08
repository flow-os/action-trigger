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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputs = void 0;
const core = __importStar(require("@actions/core"));
const inputs = {
    debug: core.getBooleanInput("debug"),
    token: core.getInput("token"),
    repo: core.getInput("repo"),
    owner: core.getInput("owner"),
    eventType: core.getInput("event_type"),
    message: JSON.parse(core.getInput("message") || "{}"),
};
function validateInputs() {
    if (!inputs.token ||
        inputs.token.trim().length == 0 ||
        !inputs.repo ||
        inputs.repo.trim().length == 0 ||
        !inputs.owner ||
        inputs.owner.trim().length == 0 ||
        !inputs.eventType ||
        inputs.eventType.trim().length == 0) {
        throw new Error("Invalid configuration provided. token, repo, owner, and event_type are required.");
    }
}
exports.validateInputs = validateInputs;
exports.default = inputs;
