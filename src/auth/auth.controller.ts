import { Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Req() req, @Res() res) {
    try {
      const user: User = {
        id: 1,
        username: req.body.username,
        password: req.body.password,
      };
      const token = this.authService.login(user);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(401).json({ message: 'Bad credentials' });
    }
  }
}
