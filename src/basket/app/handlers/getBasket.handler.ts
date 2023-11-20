import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from 'src/utils/entities';
import { Repository } from 'typeorm';
import { GetBasketQuery } from '../queries';

@QueryHandler(GetBasketQuery)
export class GetBasketHandler implements IQueryHandler<GetBasketQuery> {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
  ) {}

  async execute(query: GetBasketQuery) {
    const { userId } = query;

    return await this.basketRepository.findOne({
      where: { user: { id: userId } },
      relations: { products: true },
    });
  }
}
