import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { courseProviders } from './providers/courses.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CoursesController],
  providers: [...courseProviders, CoursesService],
})
export class CoursesModule {}
