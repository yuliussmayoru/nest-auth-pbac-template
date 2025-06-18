import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { permission } from 'process';
import { access } from 'fs';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email, deletedAt: null },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        const payload = { sub: user.id, role: user.role.name }
        const token = this.jwt.sign(payload)

        const permissions = user.role.permissions.map((rp) => ({
            action: rp.permission.action,
            resource: rp.permission.resource,
        }))

        return {
            access_toke: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role.name,
                permissions
            }
        }
    }
}
