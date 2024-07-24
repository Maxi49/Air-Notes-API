import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { CurrentUser } from 'src/CustomDecorators/getCurrentUser';
import { AuthGuard } from 'src/Guards/auth.guard';
import { Like } from './likeSchema/like-schema';
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':id')
  @UseGuards(AuthGuard)
  async likeNote(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<Like | boolean> {
    const addedLike = await this.likeService.addLike(user, id);
    return addedLike;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeLike(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    await this.likeService.removeLike(user, id);

    return true;
  }
}
