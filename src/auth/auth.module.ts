import { Module } from '@nestjs/common';
import { JwtModule,  } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OrganizationModule } from 'src/organization/organization.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { ConfigModule } from '@nestjs/config';
import { Otp } from './entities/OTP.entity';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PassportModule,
        OrganizationModule,
        UsersModule,
        MailModule,
        TypeOrmModule.forFeature([User,Organization, Otp]),
        JwtModule.register({
            secret:process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
  providers: [AuthService],
  controllers : [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
