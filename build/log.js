"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inputs_1 = __importDefault(require("./inputs"));
const log = {
    info: (...args) => {
        if (inputs_1.default.debug) {
            console.log(...args);
        }
    },
    error: (...args) => {
        if (inputs_1.default.debug) {
            console.error(...args);
        }
    },
};
exports.default = log;
