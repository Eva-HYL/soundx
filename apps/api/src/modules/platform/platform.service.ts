import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: adminDashboard / platformDashboard / listClubs / approveClub / updateClubFeatures
}
