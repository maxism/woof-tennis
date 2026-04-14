import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CoachGuard } from '../../common/guards/coach.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UuidValidationPipe } from '../../common/pipes/uuid-validation.pipe';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { QueryLocationsDto } from './dto/query-locations.dto';
import { UserEntity } from '../users/entities/user.entity';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

@Controller('locations')
@UseGuards(JwtAuthGuard, CoachGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  findAll(@CurrentUser() user: UserEntity, @Query() query: QueryLocationsDto) {
    return this.locationsService.findByCoach(user.id, query.isActive);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: `${uploadDir}/locations`,
        filename: (_req, file, cb) => {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateLocationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const photoUrl = file ? `/uploads/locations/${file.filename}` : undefined;
    return this.locationsService.create(user.id, dto, photoUrl);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: `${uploadDir}/locations`,
        filename: (_req, file, cb) => {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateLocationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const photoUrl = file ? `/uploads/locations/${file.filename}` : undefined;
    return this.locationsService.update(id, user.id, dto, photoUrl);
  }

  @Delete(':id')
  async deactivate(
    @Param('id', UuidValidationPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    await this.locationsService.deactivate(id, user.id);
    return { message: 'Локация деактивирована' };
  }
}
