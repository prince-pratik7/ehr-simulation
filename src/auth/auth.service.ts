import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/constant';
import { User } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly url = process.env.CERNER_URL;
  private readonly scope = process.env.CERNER_SCOPE;
  private readonly clientId = process.env.CERNER_CLIENT_ID;
  private readonly clientSecret = process.env.CERNER_CLIENT_SECRET;

  constructor(private readonly userService: UserService) {}

  login(user: User) {
    const foundUser = this.userService.findOne(user.username);
    if (!foundUser) {
      throw new Error('User not found');
    }
    if (foundUser.password !== user.password) {
      throw new Error('Invalid password');
    }
    const payload = { sub: foundUser.id, username: foundUser.username };
    const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: '300s' });
    return token;
  }

  validateUser(payload: any) {
    const { sub, username } = payload;
    return { id: sub, username };
  }
}
