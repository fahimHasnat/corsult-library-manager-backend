import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { ReadBookDto, PaginatedReadBookDto } from './dto/readBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { BorrowBookDto } from './dto/borrowBook.dto';
import { ReturnBookDto } from './dto/returnBook.dto';
import { Book } from './entities/book.entity';
import { Sequelize } from 'sequelize-typescript';
import { Category } from './entities/category.entity';
import { Op, QueryTypes } from 'sequelize';
import { Borrowing } from './entities/borrowing.entity';
import { BorrowingHistoryResponseDto } from './dto/borrowingHistory.dto';
import { BorrowingRecordByBookDTO } from './dto/borrowingRecordsByBookSto';
import { User } from '../users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { FilterResponseDTO } from './dto/filterDto.dto';
import { UserReportResponseDTO } from './dto/userReportResponse.dto';
import { BorrowingReportResponseDTO } from './dto/borrowingReportResponse.dto';
import { MyRedisService } from '../redis/redis.service';

@Injectable()
export class BooksService {
  constructor(
    @Inject('SEQUELIZE') private sequelize: Sequelize,
    private readonly redisService: MyRedisService,
  ) {}

  async addBook(addBook: CreateBookDto): Promise<Book> {
    const book = await Book.create<Book>(addBook);
    await this.redisService.del('filterData');
    return book;
  }

  async getBooks(query: {
    search?: string;
    category?: number;
    availability?: boolean;
    author?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedReadBookDto> {
    const {
      search,
      category,
      availability,
      author,
      page = 1,
      limit = 10,
    } = query;
    const offset = (page - 1) * limit;

    const whereClause: any = {
      [Op.and]: [
        search
          ? {
              [Op.or]: [
                { title: { [Op.iLike]: `%${search}%` } },
                { author: { [Op.iLike]: `%${search}%` } },
                { isbn: { [Op.iLike]: `%${search}%` } },
              ],
            }
          : {},
        category ? { category: { [Op.eq]: category } } : {},
        availability !== undefined
          ? { availability: { [Op.eq]: availability } }
          : {},
        author ? { author: { [Op.iLike]: `%${author}%` } } : {},
      ],
    };

    const books = await Book.findAndCountAll({
      where: whereClause,
      include: [
        { model: Category, as: 'categoryDetails', attributes: ['name'] },
      ],
      order: [['title', 'asc']],
      limit,
      offset,
    });

    return {
      data: books.rows.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.categoryDetails?.name || null,
        availability: book.availability,
      })),
      total: books.count,
      page,
      limit,
    };
  }

  async getBook(id: number): Promise<ReadBookDto> {
    const book = await Book.findByPk(id, {
      include: [
        { model: Category, as: 'categoryDetails', attributes: ['name'] },
      ],
    });
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.categoryDetails?.name || null,
      availability: book.availability,
    };
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await Book.findByPk(id);
    if (!book) {
      throw new Error('Book not found');
    }

    await book.update(updateBookDto);
    await this.redisService.del('filterData');
    return book;
  }

  async deleteBook(id: number): Promise<number> {
    const affectedCount = await Book.destroy({
      where: { id },
    });
    return affectedCount;
  }

  async borrowBook(borrowBook: BorrowBookDto, req): Promise<string> {
    return await this.sequelize.transaction(async (transaction) => {
      // Check book availability
      const book = await Book.findByPk(borrowBook.book_id, {
        attributes: ['availability'],
        transaction,
      });

      if (!book) {
        throw new HttpException(
          'No book found for your query',
          HttpStatus.NOT_FOUND,
        );
      }

      if (!book.availability) {
        throw new HttpException(
          'This book is currently unavailable',
          HttpStatus.CONFLICT,
        );
      }

      // Create borrowing record
      const borrowed = await Borrowing.create(
        {
          user_id: req.user.id,
          book_id: borrowBook.book_id,
          borrowed_date: new Date(),
          due_date: new Date(borrowBook.due_date),
        },
        { transaction },
      );

      if (!borrowed) {
        throw new HttpException(
          'Failed to create borrowing record',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Update book availability
      const [updateCount] = await Book.update(
        { availability: false },
        {
          where: { id: borrowBook.book_id },
          transaction,
        },
      );

      if (updateCount !== 1) {
        throw new HttpException(
          'Failed to update book availability',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return 'successful';
    });
  }

  async returnBook(returnBook: ReturnBookDto): Promise<string> {
    console.log('returnBook', returnBook);

    return await this.sequelize.transaction(async (transaction) => {
      // Check borrowing record existence
      const borrowing = await Borrowing.findByPk(returnBook.borrowing_id, {
        transaction,
      });

      if (!borrowing) {
        throw new HttpException(
          'No borrowing record found!',
          HttpStatus.NOT_FOUND,
        );
      }

      if (borrowing.return_date != null) {
        throw new HttpException(
          'This book is already returned!',
          HttpStatus.CONFLICT,
        );
      }

      // Update borrowing record
      const [borrowingRecordUpdate] = await Borrowing.update(
        {
          return_date: new Date(),
        },
        {
          where: {
            id: returnBook.borrowing_id,
          },
          transaction,
        },
      );

      if (borrowingRecordUpdate != 1) {
        throw new HttpException(
          'Failed to update borrowing record',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Update book availability
      const [updateCount] = await Book.update(
        { availability: true },
        {
          where: { id: returnBook.book_id },
          transaction,
        },
      );

      if (updateCount !== 1) {
        throw new HttpException(
          'Failed to update book availability',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return 'successful';
    });
  }

  async borrowingHistory(req): Promise<BorrowingHistoryResponseDto[]> {
    const borrowings = await Borrowing.findAll({
      where: { user_id: req.user.id },
      attributes: ['id', 'borrowed_date', 'due_date', 'return_date'],
      include: [
        {
          model: Book,
          attributes: [
            ['title', 'book_name'],
            ['author', 'author_name'],
            ['id', 'book_id'],
          ],
        },
      ],
      order: [['return_date', 'desc']],
      raw: true,
    });

    const formatDate = (date: Date | string): string =>
      new Date(date).toISOString().split('T')[0];

    const result: BorrowingHistoryResponseDto[] = borrowings.map(
      (borrowing) => ({
        borrowing_id: borrowing.id,
        book_name: borrowing['book.book_name'],
        author_name: borrowing['book.author_name'],
        book_id: borrowing['book.book_id'],
        borrowed_date: formatDate(borrowing.borrowed_date),
        due_date: formatDate(borrowing.due_date),
        return_date: borrowing.return_date
          ? formatDate(borrowing.return_date)
          : null,
      }),
    );

    return result;
  }

  async getBorrowingRecordsByBookId(
    bookId: number,
  ): Promise<BorrowingRecordByBookDTO[]> {
    const borrowings = await Borrowing.findAll({
      where: { book_id: bookId },
      attributes: ['id', 'borrowed_date', 'due_date', 'return_date'],
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
      raw: true,
    });

    const formatDate = (date: Date | string): string =>
      new Date(date).toISOString().split('T')[0];

    const result = borrowings.map((borrowing) => ({
      borrowing_id: borrowing.id,
      name: borrowing['user.name'],
      email: borrowing['user.email'],
      borrowed_date: formatDate(borrowing.borrowed_date),
      due_date: formatDate(borrowing.due_date),
      return_date: borrowing.return_date
        ? formatDate(borrowing.return_date)
        : null,
    }));

    return result;
  }

  async getFilters(): Promise<FilterResponseDTO> {
    const filterDataCache = await this.redisService.get('filterData');

    if (filterDataCache) {
      return JSON.parse(filterDataCache);
    }

    const filters = await this.sequelize.query(
      `
      SELECT
    	(
    		SELECT
    			array_agg(distinct(author))
    		FROM
    			corsult.books
    	) as authors,
    	(
    		SELECT
    			jsonb_agg(json_build_object('id', id, 'name', "name"))
    		FROM
    			corsult.categories
    	) as categories,
      (
		    SELECT
		  	  jsonb_object_agg(name, id) AS categories
		    FROM
			    corsult.categories
	    ) AS categories_map
      `,
      {
        type: QueryTypes.SELECT,
      },
    );

    if (!filters[0]) {
      throw new Error('Filters not found');
    }

    const filterResponse = plainToInstance(FilterResponseDTO, filters[0]);
    await this.redisService.set('filterData', JSON.stringify(filterResponse));
    return filterResponse;
  }

  async getUserReport(): Promise<UserReportResponseDTO[]> {
    const userReport = await this.sequelize.query(
      `
      SELECT
      	u.id,
      	u."name",
      	u.email,
      	COUNT(b.id)::integer AS borrow_count,
      	SUM(
      		CASE
      			WHEN due_date < COALESCE(return_date, CURRENT_DATE) THEN 1
      			ELSE 0
      		END
      	)::integer AS overdue_count
      FROM
      	corsult.borrowings b
      	RIGHT JOIN corsult.users u ON u.id = user_id
      GROUP BY
      	u.id,
      	u."name",
      	u.email;
            `,
      {
        type: QueryTypes.SELECT,
      },
    );

    const userReportResponse = plainToInstance(
      UserReportResponseDTO,
      userReport,
    );

    return userReportResponse;
  }

  async getActiveBorrowings(): Promise<BorrowingReportResponseDTO[]> {
    const borrowings = await this.sequelize.query(
      `
      SELECT
        b.id,
      	u."name",
      	u.email,
      	bk.title as "bookName",
      	b.borrowed_date as "borrowDate",
      	b.due_date as "dueDate",
      	CASE
      		WHEN b.due_date < CURRENT_DATE THEN TRUE
      		ELSE FALSE
      	END as overdue
      FROM
      	corsult.borrowings b,
      	corsult.users u,
      	corsult.books bk
      WHERE
      	b.return_date IS NULL
      	AND b.user_id = u.id
      	AND bk.id = b.book_id;
            `,
      {
        type: QueryTypes.SELECT,
      },
    );

    const borrowingsResponse = plainToInstance(
      BorrowingReportResponseDTO,
      borrowings,
    );

    return borrowingsResponse;
  }
}
