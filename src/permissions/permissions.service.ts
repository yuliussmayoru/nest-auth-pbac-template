import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { permission } from 'process';

@Injectable()
export class PermissionsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.permission.findMany({
            orderBy: { permissionName: 'asc' }
        })
    }
}
