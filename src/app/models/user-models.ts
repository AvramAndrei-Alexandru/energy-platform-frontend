export class DashboardUserModel {
    id: string;
    userName: string;
    address: string;
    birthDate: Date;
    role: Role
    roleName: string;
}

export enum Role {
    Client = 0,
    Admin = 1
}

export class UserModel {
    userName: string;
    address: string;
    birthDate: Date;
    role: Role;
    password: string;
}