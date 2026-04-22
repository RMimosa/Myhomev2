import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { NavigationContext } from "../App";

const mockAllOrders = [
  {
    id: 1,
    recommender: { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
    recipient: { name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me" },
    type: "衣橱",
    title: "白色T恤",
    description: "舒适百搭的基础款",
    time: "2024-04-19 14:30",
  },
  {
    id: 2,
    recommender: { name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
    recipient: { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
    type: "菜单",
    title: "红烧肉",
    description: "香浓美味的经典菜品",
    time: "2024-04-19 12:00",
  },
  {
    id: 3,
    recommender: { name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
    recipient: { name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
    type: "事务",
    title: "洗碗",
    description: "晚餐后清洗餐具",
    time: "2024-04-18 18:00",
  },
  {
    id: 4,
    recommender: { name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me" },
    recipient: { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
    type: "衣橱",
    title: "牛仔裤",
    description: "经典蓝色牛仔裤",
    time: "2024-04-18 10:00",
  },
  {
    id: 5,
    recommender: { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
    recipient: { name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
    type: "菜单",
    title: "清蒸鱼",
    description: "鲜嫩可口的清蒸鱼",
    time: "2024-04-17 19:00",
  },
  {
    id: 6,
    recommender: { name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me" },
    recipient: { name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
    type: "衣橱",
    title: "运动鞋",
    description: "舒适运动鞋",
    time: "2024-04-17 08:00",
  },
];

type FilterType = "全部" | "衣橱" | "菜单" | "事务";

export function FamilyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("全部");

  const filters: FilterType[] = ["全部", "衣橱", "菜单", "事务"];

  const filteredOrders =
    activeFilter === "全部"
      ? mockAllOrders
      : mockAllOrders.filter((order) => order.type === activeFilter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "衣橱":
        return "bg-blue-100 text-blue-700";
      case "菜单":
        return "bg-green-100 text-green-700";
      case "事务":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-white shadow-sm p-4 flex items-center mb-4">
        <button
          onClick={() => NavigationContext.goBack()}
          className="mr-3 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-[#2C3E50]" />
        </button>
        <h1 className="text-lg font-bold text-[#2C3E50]">家庭订单</h1>
      </div>

      <div className="sticky top-0 bg-[#FFF8F0] p-4 pb-2 z-10">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-[#FF8C42] text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start mb-3">
              <img
                src={order.recommender.avatar}
                alt={order.recommender.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium text-[#2C3E50] mr-2">
                    {order.recommender.name}
                  </span>
                  <span className="text-xs text-gray-500">推荐给</span>
                  <img
                    src={order.recipient.avatar}
                    alt={order.recipient.name}
                    className="w-5 h-5 rounded-full mx-2"
                  />
                  <span className="text-xs text-gray-500">{order.recipient.name}</span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium mr-2 ${getTypeColor(
                      order.type
                    )}`}
                  >
                    {order.type}
                  </span>
                  <p className="text-xs text-gray-400">{order.time}</p>
                </div>
              </div>
            </div>

            <div className="ml-13 pl-3 border-l-2 border-gray-100">
              <p className="text-sm font-semibold text-[#2C3E50] mb-1">
                {order.title}
              </p>
              <p className="text-xs text-gray-600">{order.description}</p>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-center">暂无{activeFilter}推荐记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
