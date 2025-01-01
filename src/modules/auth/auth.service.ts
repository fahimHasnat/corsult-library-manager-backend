import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UserRoleMap } from '../users/entities/user-role-map.entity';
import { Role } from '../users/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signIn(email: string, password: string): Promise<{ token: string }> {
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: UserRoleMap,
          attributes: ['role_id'],
          include: [
            {
              model: Role,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    console.log('user', user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    if (!user.userRoleMaps || user.userRoleMaps.length === 0) {
      throw new UnauthorizedException('User role not assigned.');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.userRoleMaps[0].role.name,
    };

    const token = this.jwtService.sign(payload);

    return { token };
  }
}
