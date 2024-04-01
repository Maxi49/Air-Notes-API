import { Module } from '@nestjs/common';
import { GeoService } from './geo.service';
import { GeoController } from './geo.controller';
import { NotesModule } from 'src/notes/notes.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [NotesModule, UsersModule],
  exports: [],
  providers: [GeoService],
  controllers: [GeoController],
})
export class GeoModule {}
