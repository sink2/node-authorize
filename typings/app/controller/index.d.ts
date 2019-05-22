// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportValidateConfig from '../../../app/controller/validateConfig';
import ExportV1Users from '../../../app/controller/v1/users';

declare module 'egg' {
  interface IController {
    validateConfig: ExportValidateConfig;
    v1: {
      users: ExportV1Users;
    }
  }
}
