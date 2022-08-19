"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.YokAtlasSearchError = void 0;
class YokAtlasSearchError extends Error {
    constructor(details) {
        super(details.reason);
        this.name = 'YokAtlasSearchError';
        this.details = details;
    }
}
exports.YokAtlasSearchError = YokAtlasSearchError;
