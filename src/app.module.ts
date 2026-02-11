import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrganizationModule } from './organization/organization.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturesModule } from './features/features.module';
import { ProfileModule } from './profile/profile.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: "root",
      password: 'MrZiyan@1234',
      database: 'organization',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule, OrganizationModule, AuthModule, FeaturesModule, ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
