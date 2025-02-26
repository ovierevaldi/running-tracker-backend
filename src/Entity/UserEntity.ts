import { Field, InputType, ObjectType } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@ObjectType()
@Entity('user')
export class UserEntity {

    @Field(() => Number)
    @PrimaryGeneratedColumn('increment')
    id: number

    @Field(() => String)
    @Column('varchar', { length: 255, unique: true })
    username: string

    @Field(() => String)
    @Column('varchar', { length: 255 })
    password: string
};

@InputType()
export class UserEntityInsInput {
    @Field(() => String)
    username: string

    @Field(() => String)
    password: string
};
