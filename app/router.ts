import { Application } from 'egg';

const v1Path = 'v1';

export default (app: Application) => {
    const { controller, router } = app;

    router.resources('users', `/auth/${v1Path}/users`, controller.v1.users);
};
