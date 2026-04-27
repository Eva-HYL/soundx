/**
 * 本地开发种子数据。幂等，可反复执行。
 *
 * 预置：
 *   - 1 个俱乐部：星辰电竞（id 自动）
 *   - 3 个老板：dev_boss_001 / dev_boss_002 / dev_boss_003
 *   - 3 个陪玩：dev_pal_001 / dev_pal_002 / dev_pal_003（各有 1-2 个 PlayerService）
 *   - 1 个管理员：dev_admin，给 club_admin 角色
 *
 * 运行：
 *   DATABASE_URL="mysql://..." pnpm prisma:seed
 *   或在 migrate reset 时自动触发
 */
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('[seed] ensure club…');
  const club = await prisma.club.upsert({
    where: { name: '星辰电竞' },
    update: {},
    create: {
      name: '星辰电竞',
      logo: null,
      description: '杭州 · 王者 / LOL 主力',
      ownerId: 1n, // 先占位，稍后更新
      ownerName: '周老板',
      ownerPhone: '13800138000',
      ownerWechat: 'zhou_boss',
      clubType: 1,
      status: 'ACTIVE',
    },
  });

  console.log('[seed] ensure admin user + club_admin role…');
  const admin = await prisma.user.upsert({
    where: { openid: 'dev_admin' },
    update: { nickname: '周老板（管理员）' },
    create: {
      openid: 'dev_admin',
      nickname: '周老板（管理员）',
      gender: 1,
      status: 'ACTIVE',
    },
  });
  await prisma.userRole.upsert({
    where: {
      userId_role_clubId: { userId: admin.id, role: 'CLUB_ADMIN', clubId: club.id },
    },
    update: { status: true },
    create: {
      userId: admin.id,
      role: 'CLUB_ADMIN',
      clubId: club.id,
      status: true,
    },
  });
  // 回填 club.ownerId 到真实 admin user id
  if (club.ownerId !== admin.id) {
    await prisma.club.update({ where: { id: club.id }, data: { ownerId: admin.id } });
  }

  console.log('[seed] ensure boss users…');
  const bossOpenids = ['dev_boss_001', 'dev_boss_002', 'dev_boss_003'];
  const bossNames = ['咕咕不鸽', '奶茶要七分糖', '摸鱼打工人'];
  for (let i = 0; i < bossOpenids.length; i++) {
    await prisma.user.upsert({
      where: { openid: bossOpenids[i] },
      update: { nickname: bossNames[i] },
      create: {
        openid: bossOpenids[i],
        nickname: bossNames[i],
        gender: 1,
        status: 'ACTIVE',
      },
    });
  }

  console.log('[seed] ensure pal users + Player + PlayerService…');
  const pals = [
    {
      openid: 'dev_pal_001',
      nickname: '带飞专业户',
      ability: '王者百星 · 偏中单',
      services: [
        { serviceType: 'rank_push', price: '40.00' },
        { serviceType: 'practice', price: '30.00' },
      ],
    },
    {
      openid: 'dev_pal_002',
      nickname: 'AhriQueen',
      ability: 'LOL 大师 · 中单 ADC',
      services: [{ serviceType: 'rank_push', price: '55.00' }],
    },
    {
      openid: 'dev_pal_003',
      nickname: '打野在哪',
      ability: 'Apex 捕食者',
      services: [{ serviceType: 'entertainment', price: '40.00' }],
    },
  ];

  for (const p of pals) {
    const palUser = await prisma.user.upsert({
      where: { openid: p.openid },
      update: { nickname: p.nickname },
      create: {
        openid: p.openid,
        nickname: p.nickname,
        gender: 0,
        status: 'ACTIVE',
      },
    });

    const player = await prisma.player.upsert({
      where: { userId: palUser.id },
      update: {
        clubId: club.id,
        nickname: p.nickname,
        level: 3,
        profileStatus: 'ACTIVE',
        ability: p.ability,
        rating: new Prisma.Decimal('4.80'),
        successRate: new Prisma.Decimal('92.00'),
      },
      create: {
        userId: palUser.id,
        clubId: club.id,
        nickname: p.nickname,
        level: 3,
        profileStatus: 'ACTIVE',
        ability: p.ability,
        rating: new Prisma.Decimal('4.80'),
        successRate: new Prisma.Decimal('92.00'),
        totalOrders: 0,
      },
    });

    // Player 必须有 PLAYER 角色，否则 rolesOverride=player 走 dev-login 时也能跑，但真 code2Session 进来会漏角色
    await prisma.userRole.upsert({
      where: {
        userId_role_clubId: { userId: palUser.id, role: 'PLAYER', clubId: club.id },
      },
      update: { status: true },
      create: {
        userId: palUser.id,
        role: 'PLAYER',
        clubId: club.id,
        status: true,
      },
    });

    // 工作状态：ONLINE 才会出现在订单池
    await prisma.playerWorkStatus.upsert({
      where: { playerId: player.id },
      update: { workStatus: 'ONLINE' },
      create: {
        playerId: player.id,
        workStatus: 'ONLINE',
      },
    });

    // PlayerService 不好 upsert（没有合适 unique key），先删再插本 player 的
    await prisma.playerService.deleteMany({ where: { playerId: player.id } });
    await prisma.playerService.createMany({
      data: p.services.map(s => ({
        playerId: player.id,
        clubId: club.id,
        serviceType: s.serviceType,
        price: new Prisma.Decimal(s.price),
      })),
    });
  }

  // 汇总
  const [userCount, playerCount, serviceCount] = await Promise.all([
    prisma.user.count(),
    prisma.player.count(),
    prisma.playerService.count(),
  ]);

  console.log('\n[seed] ✅ done');
  console.log(`  club:         ${club.name} (id=${club.id})`);
  console.log(`  users:        ${userCount} (admin + bosses + pals)`);
  console.log(`  players:      ${playerCount}`);
  console.log(`  services:     ${serviceCount}`);
  console.log('');
  console.log('  试玩账号（dev-login / wechat-login 用同样 openid）:');
  console.log(`    管理员：     openid=dev_admin          角色=club_admin`);
  console.log(`    老板：       openid=dev_boss_001..003  角色=user`);
  console.log(`    陪玩：       openid=dev_pal_001..003   角色=player（已入驻）`);
  console.log('');
  console.log('  miniapp 走 wx.login 时 code→dev_<code>，所以 code 填 boss_001 即可。');
}

main()
  .catch(err => {
    console.error('[seed] ❌ failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
