import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { UserEntity, UserEntityInsInput } from "../Entity/UserEntity.js";
import { AppDataSource } from "../data-source.js";
import forge from 'node-forge';

@Resolver()
export default class UserResolver{

  @Query(() => UserEntity)
  async getUser(@Arg('id', () => Number) id: number): Promise<UserEntity> {
    try {
      const user = await AppDataSource.getRepository(UserEntity).createQueryBuilder('user').where('user.id = :id', { id }).getOne();

      if(!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {

      if(error.message === 'User not found') {
        throw new Error(error.message);
      }
      
      throw new Error('Internal Server Error');
    }
  };

  @Mutation(() => String)
  async createUser(@Arg('input', () => UserEntityInsInput) input: UserEntityInsInput): Promise<string> {
    try {
      const md = forge.md.sha256.create();
      const hashedPassword = md.update(input.password, 'utf8');

      const user = await AppDataSource.getRepository(UserEntity).save({...input, password: hashedPassword.digest().toHex()});

      if(!user) {
        throw new Error('User not created');
      }

      return 'User created';
    } catch (error) {

      if(error.message === 'User not created') {
        throw new Error(error.message);
      }

      throw new Error('Internal Server Error');
    }
  }
}