import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { users } from './users';

@Injectable()
export class UserService {
  findOne(username: string): User {
    return users.find((user) => user.username === username);
  }
}
