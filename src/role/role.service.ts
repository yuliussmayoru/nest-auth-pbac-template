import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name)
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateRoleDto, userId: string) {
        try {
            const role = await this.prisma.role.create({
                data: {
                    name: dto.name,
                    updatedBy: userId,
                    permissions: {
                        create: dto.permissionIds.map((pid) => ({
                            permission: { connect: { id: pid}}
                        }))
                    }
                },
                include: {
                    permissions: { include: { permission: true}}
                }
            })
        } catch (error) {
            this.logger.error(`Failed to create role: ${error.message}`)
            throw new InternalServerErrorException('Failed to create role')
        }
    }

    async findAll() {
        return this.prisma.role.findMany({
            where: { deletedAt: null },
            include: {
                permissions: { include: { permission: true }}
            }
        })
    }

    async findOne(id: string) {
        const role = await this.prisma.role.findUnique({
            where: { id, deletedAt: null },
            include: {
                permissions: { include: { permission: true }}
            }
        })
        if (!role) throw new NotFoundException('Role not found')
    }

    async update(id: string, dto: UpdateRoleDto) {
        try {
            await this.prisma.rolePermission.deleteMany({ where: { roleId: id }})

            const role = await this.prisma.role.update({
                where: { id },
                data: {
                    name: dto.name,
                    permissions: {
                        create: dto.permissionIds?.map((pid) => ({
                            permission: { connect: { id: pid }}
                        }))
                    }
                },
                include: {
                    permissions: { include: { permission: true }}
                }
            })
            return role
        } catch (error) {
            this.logger.error(`Failed to update role ${id}:${error.message}`)
            throw new InternalServerErrorException('Failed to update role')
        }
    }

    async remove(id: string, userId: string) {
        try {
            await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });

            const role = await this.prisma.role.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    updatedBy: userId,
                }  
            });
            return role
        } catch (error) {
            this.logger.error(`Failed to delete role ${id}: ${error.message}`)
            throw new InternalServerErrorException('Failed to delete role')
        }
    }
}
