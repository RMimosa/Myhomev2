# 家庭互动衣橱 - 后端代码

## 技术栈
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL / MySQL
- JWT 认证
- Multer (文件上传)

## 完整后端代码

### 1. 数据库模型 (schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  phone     String   @unique
  password  String
  name      String
  avatar    String?
  familyId  String?
  family    Family?  @relation(fields: [familyId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  clothing         Clothing[]
  publishedTasks   Task[]            @relation("TaskPublisher")
  assignedTasks    Task[]            @relation("TaskAssignee")
  reviews          Review[]
  recommendations  Recommendation[]
  orders           Order[]

  @@index([familyId])
}

model Family {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members User[]
}

model Clothing {
  id        String   @id @default(uuid())
  name      String
  image     String?
  category  String
  creatorId String
  creator   User     @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  reviews         Review[]
  recommendations Recommendation[]

  @@index([creatorId])
}

model Menu {
  id        String   @id @default(uuid())
  title     String
  dishes    Json     // [{id: string, name: string}]
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders Order[]
}

model Order {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  menuId    String
  menu      Menu     @relation(fields: [menuId], references: [id], onDelete: Cascade)
  dishIds   Json     // string[]
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([menuId])
}

model Task {
  id          String   @id @default(uuid())
  name        String
  assigneeId  String
  assignee    User     @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: Cascade)
  publisherId String
  publisher   User     @relation("TaskPublisher", fields: [publisherId], references: [id], onDelete: Cascade)
  completed   Boolean  @default(false)
  publishTime DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  reviews         Review[]
  recommendations Recommendation[]

  @@index([assigneeId])
  @@index([publisherId])
}

model Review {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  targetType String   // 'clothing' | 'menu' | 'task'
  targetId   String
  content    String   @db.Text
  createdAt  DateTime @default(now())

  clothing Clothing? @relation(fields: [targetId], references: [id], onDelete: Cascade)
  task     Task?     @relation(fields: [targetId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([targetId])
}

model Recommendation {
  id           String   @id @default(uuid())
  recommenderId String
  recommender   User     @relation(fields: [recommenderId], references: [id], onDelete: Cascade)
  targetType    String   // 'clothing' | 'menu' | 'task'
  targetId      String
  recipientIds  Json     // string[]
  createdAt     DateTime @default(now())

  clothing Clothing? @relation(fields: [targetId], references: [id], onDelete: Cascade)
  task     Task?     @relation(fields: [targetId], references: [id], onDelete: Cascade)

  @@index([recommenderId])
  @@index([targetId])
}
```

### 2. 服务器入口 (src/index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/users';
import { familyRouter } from './routes/family';
import { clothingRouter } from './routes/clothing';
import { menuRouter } from './routes/menu';
import { taskRouter } from './routes/tasks';
import { reviewRouter } from './routes/reviews';
import { recommendationRouter } from './routes/recommendations';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 路由
app.use('/api/auth', authRouter);
app.use('/api/users', authMiddleware, userRouter);
app.use('/api/family', authMiddleware, familyRouter);
app.use('/api/clothing', authMiddleware, clothingRouter);
app.use('/api/menu', authMiddleware, menuRouter);
app.use('/api/tasks', authMiddleware, taskRouter);
app.use('/api/reviews', authMiddleware, reviewRouter);
app.use('/api/recommendations', authMiddleware, recommendationRouter);

// 错误处理
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 3. 认证中间件 (src/middleware/auth.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phone: string;
    familyId: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, phone: true, familyId: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 4. 认证路由 (src/routes/auth.ts)

```typescript
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const router = Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { phone, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        familyId: user.familyId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        familyId: user.familyId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export { router as authRouter };
```

### 5. 衣橱路由 (src/routes/clothing.ts)

```typescript
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = Router();

// 文件上传配置
const storage = multer.diskStorage({
  destination: 'uploads/clothing/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// 获取衣物列表
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.query;
    const targetUserId = userId || req.user!.id;

    const clothing = await prisma.clothing.findMany({
      where: { creatorId: targetUserId as string },
      include: { creator: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(clothing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clothing' });
  }
});

// 获取单个衣物
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const clothing = await prisma.clothing.findUnique({
      where: { id: req.params.id },
      include: { creator: { select: { id: true, name: true, avatar: true } } },
    });

    if (!clothing) {
      return res.status(404).json({ error: 'Clothing not found' });
    }

    res.json(clothing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clothing' });
  }
});

// 创建衣物
router.post('/', upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const { name, category } = req.body;
    const image = req.file ? `/uploads/clothing/${req.file.filename}` : undefined;

    const clothing = await prisma.clothing.create({
      data: {
        name,
        category,
        image,
        creatorId: req.user!.id,
      },
      include: { creator: { select: { id: true, name: true, avatar: true } } },
    });

    res.json(clothing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create clothing' });
  }
});

// 更新衣物
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const clothing = await prisma.clothing.findUnique({
      where: { id: req.params.id },
    });

    if (!clothing || clothing.creatorId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.clothing.update({
      where: { id: req.params.id },
      data: req.body,
      include: { creator: { select: { id: true, name: true, avatar: true } } },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update clothing' });
  }
});

// 删除衣物
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const clothing = await prisma.clothing.findUnique({
      where: { id: req.params.id },
    });

    if (!clothing || clothing.creatorId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.clothing.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete clothing' });
  }
});

export { router as clothingRouter };
```

### 6. 菜单路由 (src/routes/menu.ts)

```typescript
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// 获取当前菜单
router.get('/current', async (req: AuthRequest, res) => {
  try {
    const menu = await prisma.menu.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// 创建菜单
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, dishes } = req.body;

    // 将之前的菜单设为非活跃
    await prisma.menu.updateMany({
      where: { active: true },
      data: { active: false },
    });

    const menu = await prisma.menu.create({
      data: {
        title,
        dishes: dishes.map((name: string, index: number) => ({
          id: `dish-${Date.now()}-${index}`,
          name,
        })),
        active: true,
      },
    });

    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu' });
  }
});

// 点餐
router.post('/order', async (req: AuthRequest, res) => {
  try {
    const { dishIds } = req.body;

    const currentMenu = await prisma.menu.findFirst({
      where: { active: true },
    });

    if (!currentMenu) {
      return res.status(404).json({ error: 'No active menu' });
    }

    await prisma.order.create({
      data: {
        userId: req.user!.id,
        menuId: currentMenu.id,
        dishIds,
      },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// 点餐汇总
router.get('/summary', async (req: AuthRequest, res) => {
  try {
    const currentMenu = await prisma.menu.findFirst({
      where: { active: true },
    });

    if (!currentMenu) {
      return res.json([]);
    }

    const orders = await prisma.order.findMany({
      where: { menuId: currentMenu.id },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    const dishes = currentMenu.dishes as any[];
    const summary = dishes.map((dish) => {
      const ordersForDish = orders.filter((order) =>
        (order.dishIds as string[]).includes(dish.id)
      );

      return {
        dish,
        count: ordersForDish.length,
        orders: ordersForDish.map((order) => ({
          user: order.user,
          count: 1,
        })),
      };
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

export { router as menuRouter };
```

### 7. 家务路由 (src/routes/tasks.ts)

```typescript
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// 获取家务列表
router.get('/', async (req: AuthRequest, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        publisher: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// 获取单个家务
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        publisher: { select: { id: true, name: true, avatar: true } },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// 创建家务
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, assigneeId } = req.body;

    const task = await prisma.task.create({
      data: {
        name,
        assigneeId,
        publisherId: req.user!.id,
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        publisher: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// 完成家务
router.post('/:id/complete', async (req: AuthRequest, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!task || task.assigneeId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { completed: true },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        publisher: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

export { router as taskRouter };
```

### 8. 环境变量 (.env)

```
DATABASE_URL="postgresql://user:password@localhost:5432/family_wardrobe"
JWT_SECRET="your-secret-key-change-this-in-production"
PORT=3000
```

### 9. Package.json

```json
{
  "name": "family-wardrobe-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/multer": "^1.4.7",
    "prisma": "^5.0.0",
    "typescript": "^5.1.6",
    "ts-node-dev": "^2.0.0"
  }
}
```

## 后端部署说明

1. **安装依赖**
```bash
npm install
```

2. **配置数据库**
修改 `.env` 中的 `DATABASE_URL`

3. **运行数据库迁移**
```bash
npm run prisma:migrate
npm run prisma:generate
```

4. **开发运行**
```bash
npm run dev
```

5. **生产构建**
```bash
npm run build
npm start
```

## API端点列表

### 认证
- POST `/api/auth/register` - 注册
- POST `/api/auth/login` - 登录

### 用户
- GET `/api/users/me` - 获取当前用户
- PATCH `/api/users/me` - 更新用户信息

### 家庭
- GET `/api/family` - 获取家庭信息
- POST `/api/family` - 创建家庭
- POST `/api/family/members` - 添加成员
- POST `/api/family/leave` - 退出家庭

### 衣橱
- GET `/api/clothing` - 获取衣物列表
- GET `/api/clothing/:id` - 获取衣物详情
- POST `/api/clothing` - 创建衣物
- PATCH `/api/clothing/:id` - 更新衣物
- DELETE `/api/clothing/:id` - 删除衣物

### 菜单
- GET `/api/menu/current` - 获取当前菜单
- POST `/api/menu` - 创建菜单
- POST `/api/menu/order` - 点餐
- GET `/api/menu/summary` - 点餐汇总

### 家务
- GET `/api/tasks` - 获取家务列表
- GET `/api/tasks/:id` - 获取家务详情
- POST `/api/tasks` - 创建家务
- POST `/api/tasks/:id/complete` - 完成家务

### 评价
- GET `/api/reviews` - 获取评价列表
- GET `/api/reviews/my` - 获取我的评价
- POST `/api/reviews` - 创建评价

### 推荐
- GET `/api/recommendations` - 获取推荐列表
- POST `/api/recommendations` - 创建推荐
