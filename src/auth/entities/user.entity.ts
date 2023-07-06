import { EntityModel } from "src/common/models/entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class User extends EntityModel {

    @Column('text',{
        unique: true
    })
    email: string;

    @Column('text',{
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool',{
        default: true
    })
    isActive: boolean;

    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product;
}
