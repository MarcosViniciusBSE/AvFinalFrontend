import UserRole from "./UserRole.ts";

class User {
    id : string | null;
    username: string;
    password: string;
    userRoles: UserRole[];

    constructor(data?: Partial<User>) {
        this.id = data?.id || null;
        this.username = data?.username || "";
        this.password = data?.password || "";
        this.userRoles = data?.userRoles || [];
    }
}

export default User;