import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: getPlayer / updateMyProfile / updateWorkStatus / submitApplication / listMyOrders
}
