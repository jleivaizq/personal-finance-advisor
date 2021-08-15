import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { IsEmail } from "class-validator";
import { v4 } from 'uuid';
import { UserFixture } from "./user.fixtures";

@Entity()
export class User {

    @PrimaryKey()
    uuid: string = v4();

    @Property()
    @IsEmail()
    email!: string;

    @Property()
    username: string;
    
    @Property({ hidden: true})
    password: string;

    constructor(username: string, password: string, email: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
