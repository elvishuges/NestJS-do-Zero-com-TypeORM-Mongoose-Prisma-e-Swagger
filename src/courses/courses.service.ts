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
  // tirando do construtor para pode chamar nos testes
  @Inject('COURSES_REPOSITORY')
  private courseRepository: Repository<Course>;

  @Inject('TAGS_REPOSITORY')
  private tagRepository: Repository<Tag>;

  findAll() {
    return this.courseRepository.find({ relations: ['tags'] });
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['tags'],
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

  async remove(id: number) {
    const course = await this.courseRepository.findOne({ where: { id } });
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
