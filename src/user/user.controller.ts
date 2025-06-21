import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UserService } from './user.service';
import { Permissions } from 'src/auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards( JwtAuthGuard, PermissionsGuard)
@Controller('user')
export class UserController {
    constructor(private readonly user: UserService) {}

    @Post()
    @Permissions('manage:user')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateUserDto, @Req() req) {
        const currentUserId = req.user.userId
        return this.user.create(dto, currentUserId)
    }

    @Get()
    @Permissions('manage:user')
    findAll() {
        return this.user.findAll()
    }

    @Get(':id')
    @Permissions('manage:user')
    findOne(@Param('id') id: string) {
        return this.user.findOne(id)
    }

    @Patch(':id')
    @Permissions('manage:user')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req) {
        const currentUserId = req.user.userId
        return this.user.update(id, dto, currentUserId)
    }

    @Delete(':id')
    @Permissions('manage:user')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id') id:string, @Req() req) {
        const currentUserId = req.user.userId
        return this.user.remove(id, currentUserId)
    }
}
