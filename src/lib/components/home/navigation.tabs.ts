export interface TabDefinition {
    name: string;
    path: string;
    icon: string;
    default: boolean;
};

const home: TabDefinition = {
    name: 'Dashboard',
    path: `/users/userId/home`,
    icon: 'material-symbols:dashboard-outline-rounded',
    default: true,
};

const careplan: TabDefinition = {
    name: 'Careplan',
    path: `/users/userId/careplan`,
    icon: 'material-symbols:add-notes-outline-rounded',
    default: true,
};

const notifications: TabDefinition = {
    name: 'Notifications',
    path: `/users/userId/notifications`,
    icon: 'mdi:bell',
    default: false,
};

export const sidebarMenu = (userId : string | undefined) => {
    if (userId === undefined) {
        return [];
      }
    const menus = [
        home,
        careplan,
        // notifications
    ];
    return replaceUserId(menus, userId);
};

const replaceUserId = (menus: TabDefinition[], userId: string) => {
    return menus.map(x => {
        return {
            name: x.name,
            path: x.path.replace('userId', userId),
            icon: x.icon,
            default: x.default,
        };
    });
};
