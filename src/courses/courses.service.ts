import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course-dto';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class CoursesService {
  constructor(
    @Inject('COURSES_REPOSITORY')
    private readonly courseRepository: Repository<Course>,

    @Inject('TAGS_REPOSITORY')
    private readonly tagRepository: Repository<Tag>,
  ) {}

  findAll() {
    return this.courseRepository.find({ relations: ['tags'] });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id: +id },
      relations: ['user'],
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }

    return course;
  }

  async create(createCourseDTO: CreateCourseDto) {
    const tags = await Promise.all(
      createCourseDTO.tags.map((name) => this.preloadTagByName(name)),
    );

    const course = this.courseRepository.create({
      ...createCourseDTO,
      tags,
    });
    return this.courseRepository.save(course);
  }

  async update(id: string, updateCourseDTO: UpdateCourseDto) {
    const tags =
      updateCourseDTO.tags &&
      (await Promise.all(
        updateCourseDTO.tags.map((name) => this.preloadTagByName(name)),
      ));

    const course = await this.courseRepository.preload({
      id: +id,
      ...updateCourseDTO,
      tags,
    });

    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }

    return this.courseRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne({ where: { id: +id } });
    if (!course) {
      throw new NotFoundException(`Course ID ${id} not found`);
    }

    return this.courseRepository.remove(course);
  }

  // ao encontrar, retorna. caso não encontre, cria e retorna.
  private async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { name: name } });
    if (tag) {
      return tag;
    }
    return this.tagRepository.create({ name });
  }
}
