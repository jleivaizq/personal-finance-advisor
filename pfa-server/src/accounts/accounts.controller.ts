import { Controller, Get, Post } from '@nestjs/common';

@Controller('accounts')
export class AccountsController {

    @Get()
    findAll(): string {
        return 'Returning all the accounts';
    }

    @Post()
    create(): string {
        return 'This action creates an account';
    }

}
