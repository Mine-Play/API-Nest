import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RolesModule } from './modules/roles/roles.module';
import { WalletsModule } from './modules/wallets/wallets.module'
import { UiModule } from './modules/ui/ui.module';
import * as redisStore from 'cache-manager-redis-store';

//Mailer
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

//Queue Module
import { BullModule } from '@nestjs/bull';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { VerifyModule } from './modules/verify/verify.module';
import { EmailProcessor } from './processors/Email.processor';
import { GeoDetectProcessor } from './processors/GeoDetect.processor';
import { ServersModule } from './modules/servers/servers.module';
import { ItemsModule } from './modules/items/items.module';
import { ShopModule } from './modules/shop/shop.module';
import { NewsModule } from './modules/news/news.module';
import { SessionsModule } from './modules/sessions/sessions.module';

const TypeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST, 
  port: Number(process.env.POSTGRES_PORT), 
  username: process.env.POSTGRES_USER, 
  password: process.env.POSTGRES_PASSWORD, 
  autoLoadEntities: true,
  synchronize: true,
};

@Module({
  imports: [
    CacheModule.register({ 
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),    
    TypeOrmModule.forRoot({
      ...TypeORMConfig,
      database: 'global',
    }),
    TypeOrmModule.forRoot({
      ...TypeORMConfig,
      database: 'minigames',
      name: 'minigames',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        ignoreTLS: false,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${process.env.APP_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`
      },
      template: {
        dir: './src/resources/mail',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    BullModule.forRoot({
      prefix: "queue",
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: Number(process.env.THROTTLE_DEFAULT_TTL),
      limit: Number(process.env.THROTTLE_DEFAULT_LIMIT),
    }]),
    AuthModule,
    UsersModule,
    RolesModule,
    WalletsModule,
    UiModule,
    VerifyModule,
    ServersModule,
    ItemsModule,
    ShopModule,
    NewsModule,
    SessionsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    EmailProcessor,
    GeoDetectProcessor
  ]
})
export class AppModule {}
