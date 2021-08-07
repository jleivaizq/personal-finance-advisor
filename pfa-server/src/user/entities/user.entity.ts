import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from 'uuid';

@Entity()
export class User {

    @PrimaryKey()
    uuid: string = v4();

    @Property()
    email!: string

    constructor(email: string) {
        this.email = email;
    }
}
