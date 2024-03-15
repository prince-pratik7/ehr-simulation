import { Module } from '@nestjs/common';
import { EpicService } from './epic.service';
import { HttpModule } from '@nestjs/axios';
import { EpicController } from './epic.controller';

@Module({
  imports: [HttpModule],
  providers: [EpicService],
  exports: [EpicService],
  controllers: [EpicController],
})
export class EpicModule {}
