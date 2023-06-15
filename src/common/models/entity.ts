import { PrimaryGeneratedColumn } from "typeorm";

export abstract class EntityModel{
    @PrimaryGeneratedColumn('uuid')
    id:string;
}