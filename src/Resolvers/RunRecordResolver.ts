import { Arg, Mutation, Query } from "type-graphql";
import RunRecordEntity, { RunRecordEntityInsInput } from "../Entity/RunRecordEntity.js";
import { AppDataSource } from "../data-source.js";

export default class RunRecordResolver{
  
  @Query(() => RunRecordEntity)
  async getRunRecord(@Arg('id', () => Number) id: number): Promise<RunRecordEntity> {
    try {
      const runRecord = await AppDataSource.getRepository(RunRecordEntity).createQueryBuilder('run_record').where('run_record.id = :id', { id }).getOne();

      if(!runRecord) {
        throw new Error('Run Record not found');
      }

      return runRecord;
    } catch (error) {

      if(error.message === 'Run Record not found') {
        throw new Error(error.message);
      }
      
      throw new Error('Internal Server Error');
    }
  };

  @Mutation(() => String)
  async createRunRecord(@Arg('input', () => RunRecordEntityInsInput) input: RunRecordEntityInsInput): Promise<string> {
    try {
      const runRecord = await AppDataSource.getRepository(RunRecordEntity).save(input);

      if(!runRecord) {
        throw new Error('Run Record not created');
      }

      return 'Run Record created';
    } catch (error) {

      if(error.message === 'Run Record not created') {
        throw new Error(error.message);
      }

      throw new Error('Internal Server Error');
    }
  }
}