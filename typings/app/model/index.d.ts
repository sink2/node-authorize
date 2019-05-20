// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSecrets from '../../../app/model/secrets';

declare module 'sequelize' {
  interface Sequelize {
    Secrets: ReturnType<typeof ExportSecrets>;
  }
}
