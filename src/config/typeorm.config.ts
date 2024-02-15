import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const TypeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST, 
    port: Number(process.env.POSTGRES_PORT), 
    username: process.env.POSTGRES_USER, 
    password: process.env.POSTGRES_PASSWORD, 
    autoLoadEntities: true,
    synchronize: true,
};