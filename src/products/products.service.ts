import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/DTOs/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}
  
  async create(createProductDto: CreateProductDto):Promise<Product> {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    try {
      const {limit = 10, offset = 0} = paginationDto;
      return await this.productRepository.find({
        take: limit,
        skip: offset
      });
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findOne(term: string):Promise<Product> {
    try {
      let product: Product = null;
      
      if(isUUID(term))
        product = await this.productRepository.findOneBy({ id: term });
      else{
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder.where('UPPER(title)=:title or slug=:slug',{
          title: term.toUpperCase(),
          slug: term.toLocaleLowerCase()
        }).getOne();
      }
      if(!product)
        throw new NotFoundException(`Product ${term} not found`);
      
      return product;
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.productRepository.preload({
        id: id,
        ...updateProductDto
      });
      if(!product) throw new NotFoundException(`Product with id ${id} doesn't exist`);
  
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const product =  await this.productRepository.findOneBy({ id });
       if(!product)
        throw new NotFoundException('Product not found');
      
      await this.productRepository.remove(product);
      return `Product ${product.title} deleted successfully}`;
    } catch (error) {
      this.handleDbException(error);
    }
    return `This action removes a #${id} product`;
  }

  private handleDbException(error){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);
      
      this.logger.error(error)
      throw new InternalServerErrorException('Something was wrong');
  }
}
