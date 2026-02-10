import { Module } from '@nestjs/common';
import { JwtModule,  } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OrganizationModule } from 'src/organization/organization.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        PassportModule,
        OrganizationModule,
        UsersModule,
        JwtModule.register({
            secret:process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
    ],
  providers: [AuthService],
  controllers : [AuthController],
})
export class AuthModule { }
