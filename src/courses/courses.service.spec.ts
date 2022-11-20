import { NotFoundException } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course-dto';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';

describe('CoursesService', () => {
  let service: CoursesService;
  let id;
  let date;

  beforeEach(async () => {
    service = new CoursesService();
    id = 1;
    date = new Date();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a course', async () => {
    const expectOutputTags = [
      {
        id,
        name: 'Nestjs',
      },
    ];
    const expectOutputCourse = [
      {
        id,
        name: 'Course Test',
        description: 'O melhor curso de todos',
        tags: expectOutputTags,
      },
    ];
    // criando mocks do repositorio
    const mockCourseRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
      save: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
    };

    const mockTagRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputTags)),
      findOne: jest.fn(),
    };

    // ignorar erros do typescript
    //@ts-expect-error define part of methods
    service['courseRepository'] = mockCourseRepository;
    //@ts-expect-error define part of methods
    service['tagRepository'] = mockTagRepository;

    const createCourseDto: CreateCourseDto = {
      name: 'Course Test',
      description: 'O melhor curso de todos',
      tags: ['Nestjs'],
    };

    const newCourse = await service.create(createCourseDto);

    expect(mockCourseRepository.save).toHaveBeenCalled();
    expect(expectOutputCourse).toStrictEqual(newCourse);
  });

  it('should list courses', async () => {
    const expectOutputTags = [
      {
        id,
        name: 'Nestjs',
      },
    ];
    const expectOutputCourse = [
      {
        id,
        name: 'Course Test',
        description: 'O melhor curso de todos',
        tags: expectOutputTags,
      },
    ];
    // criando mocks do repositorio
    const mockCourseRepository = {
      findAll: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
      find: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
    };

    // ignorar erros do typescript
    //@ts-expect-error define part of methods
    service['courseRepository'] = mockCourseRepository;

    const courses = await service.findAll();
    expect(mockCourseRepository.find).toHaveBeenCalled();
    expect(expectOutputCourse).toStrictEqual(courses);
  });

  it('should gets a courses', async () => {
    const expectOutputTags = [
      {
        id,
        name: 'Nestjs',
      },
    ];
    const expectOutputCourse = [
      {
        id,
        name: 'Course Test',
        description: 'O melhor curso de todos erro',
        tags: expectOutputTags,
      },
    ];
    // criando mocks do repositorio
    const mockCourseRepository = {
      findOne: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
    };

    // ignorar erros do typescript
    //@ts-expect-error define part of methods
    service['courseRepository'] = mockCourseRepository;

    const course = await service.findOne(id);
    expect(mockCourseRepository.findOne).toHaveBeenCalled();
    expect(expectOutputCourse).toStrictEqual(course);

    try {
      await service.findOne(2);
    } catch (error) {
      console.log('error', error);

      expect(error.message).toEqual('Course ID 4 not found');
    }
  });

  it('should return exception', async () => {
    const courseId = 1;
    const notFoundException = new NotFoundException(
      `Course ID ${courseId} not found`,
    );

    const mockCourseRepository = {
      findOne: jest.fn().mockReturnValue(Promise.resolve(notFoundException)),
    };

    //@ts-expect-error define part of methods
    service['courseRepository'] = mockCourseRepository;

    try {
      await service.findOne(courseId);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toEqual(`Course ID ${courseId} not found`);
      expect(err.message).toEqual(`Course ID 123123 not found`);
    }
  });

  it('should updates a course', async () => {
    const expectOutputTags = [
      {
        id,
        name: 'Nestjs',
      },
    ];
    const expectOutputCourse = {
      id,
      name: 'Course Test',
      description: 'O melhor curso de todos',
      tags: expectOutputTags,
    };

    // criando mocks do repositorio
    const mockCourseRepository = {
      update: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
      save: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
      preload: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
    };

    const mockTagRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputTags)),
      findOne: jest.fn(),
    };

    // ignorar erros do typescript
    //@ts-expect-error define part of methods
    service['courseRepository'] = mockCourseRepository;
    //@ts-expect-error define part of methods
    service['tagRepository'] = mockTagRepository;

    const updateCourseDTO: UpdateCourseDto = {
      name: 'Course Test',
      description: 'O melhor curso de todos',
      tags: ['Nestjs'],
    };

    const course = await service.update(id, updateCourseDTO);
    console.log('curse', course);

    expect(mockCourseRepository.save).toHaveBeenCalled();
    expect(expectOutputCourse).toStrictEqual(course);
  });

  it('should remove a course', async () => {
    const expectOutputTags = [
      {
        id,
        name: 'Nestjs',
      },
    ];
    const expectOutputCourse = {
      id,
      name: 'Course Test',
      description: 'O melhor curso de todos',
      tags: expectOutputTags,
    };

    // criando mocks do repositorio
    const mockCourseRepository = {
      findOne: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
      remove: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourse)),
    };

    // ignorar erros do typescript
    //@ts-expect-error define part of methods
    service['courseRepository'] = mockCourseRepository;

    const course = await service.remove(id);

    expect(mockCourseRepository.remove).toHaveBeenCalled();
    expect(expectOutputCourse).toStrictEqual(course);
  });
});
