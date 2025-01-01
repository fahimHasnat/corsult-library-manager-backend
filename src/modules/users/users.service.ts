import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRoleMap } from './entities/user-role-map.entity';
import { Role } from './entities/role.entity';
import { UserResponseDTO } from './entities/userResponse.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const userExist = await User.findOne({
      where: { email: createUserDto.email },
    });
    if (userExist) {
      throw new ConflictException('This email already exists!');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };

    return await this.sequelize.transaction(async (transaction) => {
      const user = await User.create<User>(userToCreate, { transaction });

      await UserRoleMap.create<UserRoleMap>(
        {
          user_id: user.id,
          role_id: 2,
        },
        { transaction },
      );

      return user;
    });
  }

  async findOne(req): Promise<UserResponseDTO> {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: UserRoleMap,
          attributes: ['role_id'],
          include: [
            {
              model: Role,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.userRoleMaps[0]['role']['name'],
    };
  }

  async updateUser(req, updateUserDto: UpdateUserDto) {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update(updateUserDto);

    return user;
  }
}
