import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserEntity } from "./Entity/UserEntity.js"
import RunRecordEntity from "./Entity/RunRecordEntity.js"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "ovie",
    password: "123",
    database: "runTrackerDB",
    synchronize: true,
    logging: false,
    entities: [UserEntity, RunRecordEntity],
    migrations: [],
    subscribers: [],
})
