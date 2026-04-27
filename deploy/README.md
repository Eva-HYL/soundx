h# SoundX 部署（Docker）

## 📂 结构

```
deploy/
├── docker-compose.yml       # 基础服务：MySQL + Redis（开发 + 生产都用）
├── docker-compose.prod.yml  # 生产 overlay：+ API 容器
├── .env.example             # 环境变量模板
├── mysql/init.sql           # MySQL 首次启动初始化
└── README.md                # 本文件

apps/api/Dockerfile          # API 镜像定义（pnpm workspace 多阶段构建）
.dockerignore                # 构建上下文过滤
```

## 🎯 三种常见部署场景

### 场景 A：本地开发（DB/Redis 用 Docker，API 在宿主机直接跑）

最常见。代码热更新，迁移灵活。

```bash
cd deploy
cp .env.example .env            # 修改 MYSQL_ROOT_PASSWORD 等
docker compose up -d            # 只起 MySQL + Redis
docker compose ps               # 看容器健康状态

# 回仓库根
cd ..
export DATABASE_URL="mysql://root:<你的密码>@localhost:3306/soundx"
pnpm prisma:migrate             # 推 schema
pnpm prisma:seed                # 灌种子数据
cd apps/api && pnpm dev         # API 在 3000 端口
```

### 场景 B：数据库放服务器，API 还在本地

用户原始需求。服务器上只跑 MySQL + Redis，本地 API 远程连。

**在服务器上**：
```bash
git clone <repo>
cd <repo>/deploy
cp .env.example .env
# 改 MYSQL_ROOT_PASSWORD、打开防火墙 3306/6379
vi .env
docker compose up -d

# 验证
docker compose logs -f mysql
mysql -h localhost -u soundx_app -p soundx -e "SHOW TABLES;"
```

**在本地**：
```bash
export DATABASE_URL="mysql://soundx_app:<密码>@<服务器IP>:3306/soundx"
export REDIS_URL="redis://<服务器IP>:6379/0"
pnpm prisma:migrate
pnpm prisma:seed
cd apps/api && pnpm dev
```

> ⚠️ **安全**：3306 和 6379 尽量走**只允许特定 IP** 的防火墙规则，或者用 SSH 隧道，不要裸暴露在公网。

### 场景 C：服务器一站式（DB + Redis + API 全 Docker）

适合正式投入运行后的生产环境。

```bash
cd deploy
cp .env.example .env
vi .env     # 按实际填 DATABASE_URL / REDIS_URL（host 用服务名：mysql / redis）

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f api
```

API 容器启动时会自动跑 `prisma migrate deploy`，把最新 schema 推上去。
种子数据不会自动灌；如需要：

```bash
# 进 API 容器手动灌
docker compose exec api sh -c "cd /app && DATABASE_URL=$DATABASE_URL pnpm --filter @soundx/api exec tsx ../../prisma/seed.ts"
```

## 🔑 环境变量要点

| 变量 | 含义 | 场景 A | 场景 B | 场景 C |
|---|---|---|---|---|
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 | 随便 | ⚠️ 生产必改 | ⚠️ 生产必改 |
| `MYSQL_PORT` | 宿主端口 | 3306 | 3306（外网访问） | 可注释掉（走内网） |
| `DATABASE_URL` | 应用连接串 | `localhost:3306` | `<服务器IP>:3306` | `mysql:3306`（服务名） |
| `REDIS_URL` | Redis 连接串 | `localhost:6379` | `<服务器IP>:6379` | `redis:6379` |
| `JWT_SECRET` | JWT 签名密钥 | 随便 | 随机 32+ 字符 | 随机 32+ 字符 |
| `WX_APP_ID/SECRET` | 微信小程序 | 留空走 stub | 留空走 stub | 真实值 |
| `CORS_ORIGINS` | 允许的前端域名 | `http://localhost:5173` | 同左 | 真实域名，逗号分隔 |

## 🛠 常用命令

```bash
# 只起/停 DB
docker compose up -d mysql redis
docker compose stop mysql redis

# 查日志
docker compose logs -f mysql
docker compose logs -f --tail=100 api

# 连进 MySQL 交互
docker compose exec mysql mysql -u root -p soundx

# 删除数据重来（危险）
docker compose down -v

# 查容器资源占用
docker stats soundx-mysql soundx-redis

# 备份 DB（宿主机任意位置生成 soundx-<日期>.sql）
docker compose exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} soundx > soundx-$(date +%F).sql

# 恢复
cat soundx-2026-04-24.sql | docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} soundx
```

## 🧱 卷与持久化

命名卷存在 Docker 管理的位置（`docker volume ls` 能看到 `deploy_mysql_data`、`deploy_redis_data`）。
`docker compose down` 保留卷，`down -v` 才删。

**数据迁移到新服务器**：
```bash
docker run --rm -v deploy_mysql_data:/from -v $(pwd):/to alpine \
  tar czf /to/mysql-backup.tar.gz -C /from .
# 在新机器上解压到新卷即可
```

## ⚠️ 坑位提醒

- `init.sql` 只在 **数据卷首次创建** 时执行。之后想改用户/密码：`docker compose down -v` 然后重来，或进容器手动 ALTER。
- `prisma migrate deploy` 是生产模式，不会交互式提示。**新环境要先 `pnpm prisma:migrate` 生成 migrations 并提交到仓库**，否则服务器上没有可执行的 migration 文件。
- Node 20 + pnpm 9 + Prisma 5.22 的组合已在 Dockerfile 里固化。想升级请同步改 `base` stage 和 corepack prepare 版本。
- MySQL 8 的 `mysql_native_password` 插件在某些云托管 MySQL 版本已不可用。如果用云数据库（RDS/PolarDB）而不是这里的容器，直接去掉 compose 里的 `--default-authentication-plugin` 参数即可。
