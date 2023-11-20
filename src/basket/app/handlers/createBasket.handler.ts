import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from 'src/utils/entities';
import { Repository } from 'typeorm';
import { CreateBasketCommand } from '../commands/createBasket.command';

@CommandHandler(CreateBasketCommand)
export class CreateBasketHandler
  implements ICommandHandler<CreateBasketCommand>
{
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
  ) {}

  async execute(command: CreateBasketCommand) {
    const { userId } = command;

    const newBasket = this.basketRepository.create({
      user: { id: userId },
    });
    return await this.basketRepository.save(newBasket);
  }
}
