// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportV1Users from '../../../app/controller/v1/users';

declare module 'egg' {
  interface IController {
    v1: {
      users: ExportV1Users;
    }
  }
}
