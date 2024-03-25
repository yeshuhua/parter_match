import { UserType } from "./user";

/**
 * 队伍类型
 */
export type TeamType = {
    id: number;
    name: string;
    userId: number;
    description: string;
    expireTime?: string;
    maxNum: number;
    password?: string;
    status: TeamStatus;
    createTime?: Date;
    updateTime?: Date;
    Users?: UserType[];
}

export type EditTeamType = {
    password?: string;
    status?: TeamStatus;
    expireTime?: string | stirng[];
    description?: string;
    name?: string;
}

enum TeamStatus {
    Public = 0,
    Private = 1,
    Secret = 2
}