import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class WithdrawService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: create (freeze points) / listMine / adminList / approve / reject / confirmTransfer
}
