import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrganizationModule } from './organization/organization.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
  TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: "root",
  password: 'MrZiyan@1234',
  database: 'organization',
  autoLoadEntities: true, 
  synchronize: true,
}),
    UsersModule, OrganizationModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
