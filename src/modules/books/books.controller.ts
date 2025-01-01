import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { BooksService } from './books.service';
// import * as dayjs from 'dayjs';
import { LoggingInterceptor } from '../../loggin.interceptor';
import { UpdateBookDto } from './dto/updateBook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role/role.decorator';
import { RolesGuard } from '../auth/role/role.guard';
import { BorrowBookDto } from './dto/borrowBook.dto';
import { ReturnBookDto } from './dto/returnBook.dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  async getBooks(
    @Query()
    query: {
      search?: string;
      category: number;
      availability: boolean;
      author: string;
      page?: number;
      limit?: number;
    },
  ) {
    try {
      const books = await this.booksService.getBooks(query);
      return {
        status: HttpStatus.OK,
        message: 'Successful',
        data: books.data,
        total: books.total,
        page: books.page,
        limit: books.limit,
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

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  async addBook(@Body(new ValidationPipe()) addBook: CreateBookDto) {
    try {
      const newBook = await this.booksService.addBook(addBook);
      return {
        status: HttpStatus.CREATED,
        message: 'Book Added successfully',
        data: newBook,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to add book',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateBook: UpdateBookDto,
  ) {
    try {
      const book = await this.booksService.updateBook(id, updateBook);
      if (!book) {
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
        message: 'Book updated successfully',
        data: {},
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update book',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    try {
      const affected = await this.booksService.deleteBook(id);
      if (affected == 0) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Deletion Failed',
            error: 'Deletion Failed',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        status: HttpStatus.OK,
        message: 'Book Deleted successfully',
        data: {},
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete book',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('borrow')
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  async borrowBook(
    @Body(new ValidationPipe()) borrowBookDto: BorrowBookDto,
    @Req() req: Request,
  ) {
    try {
      const borrowBook = await this.booksService.borrowBook(borrowBookDto, req);
      console.log(borrowBook);
      return {
        status: HttpStatus.OK,
        message: 'Book Borrowed successfully',
        data: [],
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to borrow book',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('return')
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  async returnBook(@Body(new ValidationPipe()) returnBook: ReturnBookDto) {
    try {
      await this.booksService.returnBook(returnBook);
      return {
        status: HttpStatus.OK,
        message: 'Book Returned successfully',
        data: [],
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to borrow book',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('records')
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  async getBorrowingHistory(@Req() req: Request) {
    try {
      const borrwoingHistory = await this.booksService.borrowingHistory(req);
      return {
        status: HttpStatus.OK,
        message: 'Successful',
        data: borrwoingHistory,
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

  @Get('filters')
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  async getFilters() {
    try {
      const filters = await this.booksService.getFilters();
      return {
        status: HttpStatus.OK,
        message: 'Filters retrieved successfully',
        data: filters,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve filters',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user-report')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async getUserReport() {
    try {
      const records = await this.booksService.getUserReport();
      return {
        status: HttpStatus.OK,
        message: 'User records retrieved successfully',
        data: records,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve user records',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('borrowing-report')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async getBorrowings() {
    try {
      const records = await this.booksService.getActiveBorrowings();
      return {
        status: HttpStatus.OK,
        message: 'Borrowing records retrieved successfully',
        data: records,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve Borrowing records',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @Roles('admin', 'user')
  @UseGuards(RolesGuard)
  async getBook(@Param('id', ParseIntPipe) id: number) {
    try {
      const book = await this.booksService.getBook(id);
      if (!book) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: 'Not Found ',
            error: 'Search Parameter Is Not Valid',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        status: HttpStatus.OK,
        message: 'Successful',
        data: book,
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

  @Get('borrowing-records/:bookId')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async getBorrowingRecordsByBookId(
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    try {
      const records =
        await this.booksService.getBorrowingRecordsByBookId(bookId);
      return {
        status: HttpStatus.OK,
        message: 'Borrowing records retrieved successfully',
        data: records,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve borrowing records',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
