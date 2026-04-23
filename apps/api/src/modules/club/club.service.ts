import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class ClubService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: getClub / joinClub / listPlayers / listServices
}
