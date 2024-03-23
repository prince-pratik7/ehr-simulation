import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CernerModule } from './cerner/cerner.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { JwtStrategy } from './auth/jsw.strategy';
import { AuthModule } from './auth/auth.module';
import { EpicModule } from './epic/epic.module';
import { AnalyzePolicyPdfModule } from './analyze-policy-pdf/analyze-policy-pdf.module';

@Module({
  imports: [
    AnalyzePolicyPdfModule,
    CernerModule,
    AuthModule,
    EpicModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300s' },
    }),
  ],

  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
