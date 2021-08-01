import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Account {

    @PrimaryKey()  
    _id!: number;

    @Property()  
    name!: string;
}