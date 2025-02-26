import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { UserEntity, UserEntityInsInput, UserEntityLoginOutput } from "../Entity/UserEntity.js";
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

  @Query(() => UserEntityLoginOutput)
  async login(@Arg('username', () => String) username: string, @Arg('password', () => String) password: string): Promise<UserEntityLoginOutput> {
    try {
      const md = forge.md.sha256.create();
      const hashedPassword  = md.update(password, 'utf8');

      const user = await AppDataSource.getRepository(UserEntity).createQueryBuilder('user').where('user.username = :username', { username }).getOne();

      if(!user) {
        throw new Error('User not found');
      };

      if(user.password !== hashedPassword.digest().toHex()) {
        throw new Error('Invalid username or password');
      };

      return {
        id: user.id,
        username: user.username
      };

    } catch (error) {
      if(error.message === 'User not found' || error.message === 'Invalid username or password') {
        throw new Error(error.message);
      }

      throw new Error('Internal Server Error');
    }
  }

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