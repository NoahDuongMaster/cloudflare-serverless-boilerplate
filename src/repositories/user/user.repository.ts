import { user } from '@/repositories/schema';
import {
  TUserCreateDto,
  TUserCreateManyDto,
  TUserUpdateDto,
  ZUserCreateDto,
  ZUserCreateManyDto,
  ZUserUpdateDto,
} from '@/repositories/user/user.schema';
import { TEnvironments } from '@/schemas/common.schema';
import { D1Service, TD1Service } from '@/services/d1.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { eq } from 'drizzle-orm';

dayjs.extend(utc);

class UserRepository {
  private userRepository: TD1Service;
  constructor(env: TEnvironments) {
    this.userRepository = D1Service.connect(env);
  }

  public async create(data: TUserCreateDto) {
    const parsedData = ZUserCreateDto.safeParse(data);

    if (!parsedData.success) {
      throw new Error('Invalid input data');
    }

    return this.userRepository.insert(user).values(parsedData.data);
  }

  public async createMany(data: TUserCreateManyDto) {
    const parsedData = ZUserCreateManyDto.safeParse(data);

    if (!parsedData.success) {
      throw new Error('Invalid input data');
    }

    return this.userRepository.insert(user).values(parsedData.data).returning();
  }

  public async update(id: string, data: TUserUpdateDto) {
    const parsedData = ZUserUpdateDto.safeParse(data);

    if (!parsedData.success) {
      throw new Error('Invalid input data');
    }

    return this.userRepository
      .update(user)
      .set(parsedData.data)
      .where(eq(user.id, id));
  }

  public async findById(id: string) {
    return this.userRepository.query.user.findFirst({
      where: eq(user.id, id),
    });
  }
}

export default UserRepository;
