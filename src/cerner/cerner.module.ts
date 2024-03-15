// cerner.module.ts
import { Module } from '@nestjs/common';
import { CernerController } from './cerner.controller';
import { CernerService } from './cerner.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CernerController],
  providers: [CernerService],
  exports: [CernerService],
})
export class CernerModule {}
