import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/roles.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('role')
export class RoleController {
    constructor(private readonly role: RoleService) {}

    @Post()
    @Permissions('manage:role')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateRoleDto, @Req() req) {
        const user = req.user as { userId: string }
        return this.role.create(dto, user.userId)
    }

    @Get()
    @Permissions('manage:roles')
    async findAll() {
        return this.role.findAll()
    }

    @Get(':id')
    @Permissions('manage:roles')
    async findOne(@Param('id') id: string) {
        return this.role.findOne(id)
    }

    @Patch(':id')
    @Permissions('update:role')
    async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.role.update(id, dto);
    }

    @Delete(':id')
    @Permissions('delete:role')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string, @Req() req) {
        const user = req.user as { userId: string };
        return this.role.remove(id, user.userId);
    }
}
