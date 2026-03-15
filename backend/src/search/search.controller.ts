import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get('users')
  @ApiOperation({ summary: 'Search users' })
  async searchUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.searchService.searchUsers({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      search,
      sortBy,
      sortOrder,
    });
  }

  @Get('projects')
  @ApiOperation({ summary: 'Search projects' })
  async searchProjects(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.searchService.searchProjects({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      search,
      sortBy,
      sortOrder,
    });
  }

  @Get('service-offers')
  @ApiOperation({ summary: 'Search service offers' })
  async searchServiceOffers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.searchService.searchServiceOffers({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      search,
      sortBy,
      sortOrder,
    });
  }
}