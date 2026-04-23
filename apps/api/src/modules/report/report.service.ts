import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: startService / finishService / submitReport / adminList / approve (tx + points_flow) / reject
}
