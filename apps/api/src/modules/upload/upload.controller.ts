import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthContext } from '@/common/types/auth-context';
import { StorageService } from '@/infra/storage/storage.service';
import { ResolveFileDto, SignUploadDto } from './dto/sign-upload.dto';

@ApiTags('uploads')
@Controller('uploads')
export class UploadController {
  constructor(private readonly storage: StorageService) {}

  @Post('sign')
  @ApiOperation({ summary: '申请预签名上传' })
  sign(@Body() dto: SignUploadDto, @CurrentUser() user: AuthContext) {
    return this.storage.signUpload({ ...dto, userId: user.userId });
  }

  @Post('resolve')
  @ApiOperation({ summary: '批量把 fileKey 解析为 FileRef' })
  async resolve(@Body() dto: ResolveFileDto) {
    const files = await this.storage.resolveFileRefs(dto.fileKeys);
    return { files };
  }
}
