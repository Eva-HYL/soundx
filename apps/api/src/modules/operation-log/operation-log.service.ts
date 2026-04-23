import { Injectable } from '@nestjs/common';
import type { OperationAction } from '@soundx/shared-types';
import { PrismaService } from '@/infra/prisma/prisma.service';

export interface RecordOperationInput {
  operatorId: bigint | number;
  operatorRole: string;
  action: OperationAction;
  targetType: string;
  targetId?: string;
  clubId?: bigint | number;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
  remark?: string;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class OperationLogService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: record(input) / list(query)
}
