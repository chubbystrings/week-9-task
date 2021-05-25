export interface Org {
    id?: string;
    organization: string;
    products: string[];
    marketValue: string;
    address: string;
    ceo: string;
    country: string;
    noOfEmployees: number;
    employees: string[];
    createdAt?: Date;
    updatedAt?: Date | null;

}

export interface IUser {
    id? : string;
    name: string;
    email: string;
    password: string;
    repeat_password: string;
}

export type ICurrentUser = string | IUser

export type either = Org | undefined;
