/* eslint-disable @typescript-eslint/no-explicit-any */

import Joi from 'joi';

interface YokASE_ErrorBase {
  reason: string;
  error: any;
}

interface YokASE_RequestConfigValidationError extends YokASE_ErrorBase {
  reason: 'request-config-validation-failed';
  error: Joi.ValidationError;
}

interface YokASE_RequestError extends YokASE_ErrorBase {
  reason: 'request-failed';
  error: any;
}

interface YokASE_PostProcessError extends YokASE_ErrorBase {
  reason: 'post-process-failed';
  error: any;
  searchResultRaw: any;
}

interface YokASE_UnknownError extends YokASE_ErrorBase {
  reason: 'unknown';
  error: any;
}

type YokAtlasSearchErrorDetails =
  | YokASE_RequestConfigValidationError
  | YokASE_RequestError
  | YokASE_PostProcessError
  | YokASE_UnknownError;

export class YokAtlasSearchError extends Error {
  details: YokAtlasSearchErrorDetails;

  constructor(details: YokAtlasSearchErrorDetails) {
    super(details.reason);
    this.name = 'YokAtlasSearchError';

    this.details = details;
  }
}
