import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

@ObjectType()
@Entity('run_record')
export default class RunRecordEntity{
  @Field(() => Number)  
  @Column('int', { primary: true, generated: true })
  id: number

  @Field(() => String, {nullable: true})
  @Column('varchar', { length: 255, nullable: true })
  title?: string

  @Field(() => String, {nullable: true})
  @Column("date", {nullable: true})
  date?: Date

  @Field(() => Number)
  @Column('float')
  distance: number

  @Field(() => Number)
  @Column('float')
  duration: number
};

@InputType()
export class RunRecordEntityInsInput {
  @Field(() => String, {nullable: true})
  title?: string

  @Field(() => String, {nullable: true})
  date?: Date

  @Field(() => Number)
  distance: number

  @Field(() => Number)
  duration: number
}