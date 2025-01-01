import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpStatus,
  HttpException,
  UseGuards,
  Req,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../auth/role/role.decorator';
import { RolesGuard } from '../auth/role/role.guard';
import { LoggingInterceptor } from 'src/loggin.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);

      return {
        status: HttpStatus.CREATED,
        message: 'Account Created Successfully',
        data: user,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create account',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('/info')
  async getUserInfo(@Req() req: Request) {
    try {
      const userInfo = await this.usersService.findOne(req);
      return {
        status: HttpStatus.OK,
        message: 'Successful',
        data: userInfo,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed To Get Result!',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('')
  @Roles('user')
  async updateBook(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.updateUser(req, updateUserDto);
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Update Failed',
            error: 'Update Failed',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        status: HttpStatus.OK,
        message: 'Updated successfully',
        data: user,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
