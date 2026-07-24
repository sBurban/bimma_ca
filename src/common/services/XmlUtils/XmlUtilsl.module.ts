import { Module } from '@nestjs/common';
import { XmlUtilsService } from './XmlUtilsl.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [XmlUtilsService],
  exports: [XmlUtilsService],
})
export class XmlUtilsModule {}
