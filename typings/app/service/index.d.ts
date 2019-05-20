// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportResponseHelper from '../../../app/service/ResponseHelper';
import ExportTest from '../../../app/service/Test';

declare module 'egg' {
  interface IService {
    responseHelper: ExportResponseHelper;
    test: ExportTest;
  }
}
