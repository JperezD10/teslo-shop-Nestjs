import { User } from "src/auth/entities/user.entity";
import { EntityModel } from "src/common/models/entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Product extends EntityModel {

    @Column('text',{
        unique: true,
    })
    title:string;

    @Column('float',{
        default: 0
    })
    price: number;

    @Column('text',{
        nullable: true
    })
    description: string;

    @Column('text',{
        unique: true
    })
    slug: string;

    @Column('int',{
        default: 0
    })
    stock: number;

    @Column('text',{
        array: true
    })
    sizes: string[];

    @Column('text')
    gender:string;

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager: true}
    )
    user: User

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title;
        }
        this.setSlug();
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.setSlug();
    }

    private setSlug(){
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'",'')
    }
}
