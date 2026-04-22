# 家庭互动衣橱 - 前端代码

## 技术栈
- React 18 + TypeScript
- Tailwind CSS
- Lucide React (图标)
- Sonner (Toast提示)

## 完整前端代码

### 1. App.tsx (主应用入口)

```tsx
import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { FamilyPage } from "./pages/FamilyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AddClothingPage } from "./pages/AddClothingPage";
import { ClothingDetailPage } from "./pages/ClothingDetailPage";
import { PublishMenuPage } from "./pages/PublishMenuPage";
import { OrderSummaryPage } from "./pages/OrderSummaryPage";
import { PublishTaskPage } from "./pages/PublishTaskPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { AddMemberPage } from "./pages/AddMemberPage";
import { FamilyOrdersPage } from "./pages/FamilyOrdersPage";
import { MyReviewsPage } from "./pages/MyReviewsPage";
import { Home, Users, User } from "lucide-react";
import { Toaster } from "sonner";

export type Route =
  | { page: "home" }
  | { page: "family" }
  | { page: "profile" }
  | { page: "clothing-add" }
  | { page: "clothing-detail"; id: string }
  | { page: "menu-publish" }
  | { page: "menu-summary" }
  | { page: "tasks-publish" }
  | { page: "task-detail"; id: string }
  | { page: "family-add-member" }
  | { page: "family-orders" }
  | { page: "profile-reviews" };

export const NavigationContext = {
  navigate: (route: Route) => {},
  goBack: () => {},
  currentRoute: { page: "home" } as Route,
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>({ page: "home" });
  const [routeHistory, setRouteHistory] = useState<Route[]>([{ page: "home" }]);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    setRouteHistory([...routeHistory, route]);
  };

  const goBack = () => {
    if (routeHistory.length > 1) {
      const newHistory = routeHistory.slice(0, -1);
      setRouteHistory(newHistory);
      setCurrentRoute(newHistory[newHistory.length - 1]);
    }
  };

  NavigationContext.navigate = navigate;
  NavigationContext.goBack = goBack;
  NavigationContext.currentRoute = currentRoute;

  const navItems = [
    { route: { page: "home" as const }, icon: Home, label: "主页" },
    { route: { page: "family" as const }, icon: Users, label: "家庭中心" },
    { route: { page: "profile" as const }, icon: User, label: "我的" },
  ];

  const isActive = (page: string) => currentRoute.page === page;

  const renderPage = () => {
    switch (currentRoute.page) {
      case "home": return <HomePage />;
      case "family": return <FamilyPage />;
      case "profile": return <ProfilePage />;
      case "clothing-add": return <AddClothingPage />;
      case "clothing-detail": return <ClothingDetailPage id={currentRoute.id} />;
      case "menu-publish": return <PublishMenuPage />;
      case "menu-summary": return <OrderSummaryPage />;
      case "tasks-publish": return <PublishTaskPage />;
      case "task-detail": return <TaskDetailPage id={currentRoute.id} />;
      case "family-add-member": return <AddMemberPage />;
      case "family-orders": return <FamilyOrdersPage />;
      case "profile-reviews": return <MyReviewsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFF8F0] max-w-[393px] mx-auto">
      <main className="flex-1 overflow-y-auto pb-16">
        {renderPage()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.route.page);
            return (
              <button
                key={item.route.page}
                onClick={() => navigate(item.route)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active ? "text-[#FF8C42]" : "text-gray-500"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" strokeWidth={2} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <Toaster />
    </div>
  );
}
```

### 2. API Service (api.ts)

```tsx
// API基础配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// 通用请求函数
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// 类型定义
export interface User {
  id: string;
  name: string;
  avatar: string;
  familyId: string;
}

export interface Family {
  id: string;
  name: string;
  members: User[];
}

export interface Clothing {
  id: string;
  name: string;
  image: string;
  category: string;
  creatorId: string;
  creator: User;
}

export interface Dish {
  id: string;
  name: string;
}

export interface Menu {
  id: string;
  title: string;
  dishes: Dish[];
  createdAt: string;
}

export interface Order {
  userId: string;
  dishIds: string[];
}

export interface Task {
  id: string;
  name: string;
  assigneeId: string;
  assignee: User;
  publisherId: string;
  publisher: User;
  completed: boolean;
  publishTime: string;
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  targetType: 'clothing' | 'menu' | 'task';
  targetId: string;
  content: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  recommenderId: string;
  recommender: User;
  targetType: 'clothing' | 'menu' | 'task';
  targetId: string;
  targetTitle: string;
  recipientIds: string[];
  createdAt: string;
}

// API函数
export const api = {
  // 认证
  auth: {
    login: (phone: string, password: string) => 
      request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      }),
    register: (phone: string, password: string, name: string) =>
      request<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ phone, password, name }),
      }),
  },

  // 用户
  users: {
    getMe: () => request<User>('/users/me'),
    updateProfile: (data: Partial<User>) =>
      request<User>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // 家庭
  family: {
    get: () => request<Family>('/family'),
    create: (name: string) =>
      request<Family>('/family', {
        method: 'POST',
        body: JSON.stringify({ name }),
      }),
    addMember: (phone: string) =>
      request<Family>('/family/members', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      }),
    leave: () =>
      request<void>('/family/leave', { method: 'POST' }),
  },

  // 衣橱
  clothing: {
    list: (userId?: string) =>
      request<Clothing[]>(`/clothing${userId ? `?userId=${userId}` : ''}`),
    get: (id: string) => request<Clothing>(`/clothing/${id}`),
    create: (data: { name: string; image?: string; category: string }) =>
      request<Clothing>('/clothing', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Clothing>) =>
      request<Clothing>(`/clothing/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/clothing/${id}`, { method: 'DELETE' }),
  },

  // 菜单
  menu: {
    getCurrent: () => request<Menu | null>('/menu/current'),
    create: (title: string, dishes: string[]) =>
      request<Menu>('/menu', {
        method: 'POST',
        body: JSON.stringify({ title, dishes }),
      }),
    order: (dishIds: string[]) =>
      request<void>('/menu/order', {
        method: 'POST',
        body: JSON.stringify({ dishIds }),
      }),
    getOrderSummary: () =>
      request<{ dish: Dish; count: number; orders: { user: User; count: number }[] }[]>('/menu/summary'),
  },

  // 家务
  tasks: {
    list: () => request<Task[]>('/tasks'),
    get: (id: string) => request<Task>(`/tasks/${id}`),
    create: (name: string, assigneeId: string) =>
      request<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify({ name, assigneeId }),
      }),
    complete: (id: string) =>
      request<Task>(`/tasks/${id}/complete`, { method: 'POST' }),
  },

  // 评价
  reviews: {
    list: (targetType?: string, targetId?: string) => {
      const params = new URLSearchParams();
      if (targetType) params.append('targetType', targetType);
      if (targetId) params.append('targetId', targetId);
      return request<Review[]>(`/reviews?${params}`);
    },
    myReviews: () => request<Review[]>('/reviews/my'),
    create: (targetType: string, targetId: string, content: string) =>
      request<Review>('/reviews', {
        method: 'POST',
        body: JSON.stringify({ targetType, targetId, content }),
      }),
  },

  // 推荐
  recommendations: {
    list: () => request<Recommendation[]>('/recommendations'),
    create: (targetType: string, targetId: string, recipientIds: string[]) =>
      request<Recommendation>('/recommendations', {
        method: 'POST',
        body: JSON.stringify({ targetType, targetId, recipientIds }),
      }),
  },
};
```

### 3. 数据 Hooks (useData.ts)

```tsx
import { useState, useEffect } from 'react';
import { api } from './api';

// 使用示例Hook
export function useClothingList(userId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.clothing.list(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading, error, refetch: () => {} };
}

export function useFamily() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.family.get()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useTasks() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.tasks.list()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
```

### 4. 环境变量 (.env)

```
REACT_APP_API_URL=http://localhost:3000/api
```

## 前端部署说明

1. **安装依赖**
```bash
npm install
```

2. **配置环境变量**
创建 `.env` 文件并设置API地址

3. **开发运行**
```bash
npm start
```

4. **生产构建**
```bash
npm run build
```

## 与后端集成

前端通过 `api.ts` 中定义的接口与后端通信：

- 所有请求自动添加 JWT token（从 localStorage 读取）
- 统一的错误处理
- TypeScript 类型安全

### 使用示例

```tsx
// 在组件中使用
import { api } from './api';
import { toast } from 'sonner';

function MyComponent() {
  const handleAddClothing = async () => {
    try {
      const clothing = await api.clothing.create({
        name: "白色T恤",
        category: "上衣",
      });
      toast.success("添加成功！");
    } catch (error) {
      toast.error("添加失败");
    }
  };

  return <button onClick={handleAddClothing}>添加衣物</button>;
}
```
