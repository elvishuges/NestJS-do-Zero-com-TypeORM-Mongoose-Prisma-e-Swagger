import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';
import { courseProviders } from './providers/courses.providers';
import { tagsProviders } from './providers/tags.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CoursesController],
  providers: [...courseProviders, ...tagsProviders, CoursesService],
})
export class CoursesModule {}
