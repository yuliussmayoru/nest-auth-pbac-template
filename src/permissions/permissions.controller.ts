import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly perms: PermissionsService) {}

    @Get()
    findAll() {
        return this.perms.findAll();
    }
}
