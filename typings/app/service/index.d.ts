// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportQueryHelper from '../../../app/service/QueryHelper';
import ExportResponseHelper from '../../../app/service/ResponseHelper';

declare module 'egg' {
  interface IService {
    queryHelper: ExportQueryHelper;
    responseHelper: ExportResponseHelper;
  }
}
