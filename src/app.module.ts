import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import configuration from './config/configuration';

import { XmlUtilsModule } from './common/services/XmlUtils/XmlUtilsl.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleMakesModule } from './modules/vehicle-makes/vehicle-makes.module';
import { VehicleMakeTypesModule } from './modules/vehicle-make-types/vehicle-make-types.module';

// GraphQLModule.forRoot({
//   formatError: (error) => ({
//     message: error.message,
//     code: error.extensions?.code,
//   }),
// });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST'),
        database: config.get<string>('DB_NAME'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        models: [],
        autoLoadModels: true,
        synchronize: true, // Only True during Development
        logging: false,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false, // Deprecated
      graphiql: true, // Playground
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.d.ts'),
        skipResolverArgs: true,
      },
      // formatError: (error) => ({
      //   message: error.message,
      //   code: error.extensions?.code,
      // }),
    }),
    XmlUtilsModule,
    VehicleMakesModule,
    VehicleMakeTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
