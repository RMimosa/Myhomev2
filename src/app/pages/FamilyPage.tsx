import { Plus, LogOut } from "lucide-react";
import { useState } from "react";
import { NavigationContext } from "../App";

const mockFamily = {
  name: "温馨小家",
  members: [
    { id: 1, name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
    { id: 2, name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
    { id: 3, name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
    { id: 4, name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me" },
  ],
};

const mockOrders = [
  {
    id: 1,
    recommender: { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
    recipient: { name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me" },
    type: "衣橱",
    title: "白色T恤",
    time: "2小时前",
  },
  {
    id: 2,
    recommender: { name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
    recipient: { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
    type: "菜单",
    title: "红烧肉",
    time: "5小时前",
  },
  {
    id: 3,
    recommender: { name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
    recipient: { name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
    type: "事务",
    title: "洗碗",
    time: "1天前",
  },
];

export function FamilyPage() {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
      <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-4">
        <h1 className="text-xl font-bold text-[#2C3E50] mb-1">
          {mockFamily.name}
        </h1>
        <p className="text-sm text-gray-500">{mockFamily.members.length} 位成员</p>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3 px-2">家庭成员</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap gap-6">
              {mockFamily.members.map((member) => (
                <div key={member.id} className="flex flex-col items-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-full mb-2"
                  />
                  <span className="text-xs text-[#2C3E50]">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-sm font-semibold text-gray-600">家庭订单</h2>
            <button
              onClick={() => NavigationContext.navigate({ page: "family-orders" })}
              className="text-xs text-[#FF8C42]"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {mockOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <img
                    src={order.recommender.avatar}
                    alt={order.recommender.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm font-medium text-[#2C3E50]">
                    {order.recommender.name}
                  </span>
                  <span className="text-xs text-gray-500 mx-2">→</span>
                  <img
                    src={order.recipient.avatar}
                    alt={order.recipient.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-600">{order.recipient.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium mr-2 ${getTypeColor(
                        order.type
                      )}`}
                    >
                      {order.type}
                    </span>
                    <p className="text-sm text-[#2C3E50] truncate">{order.title}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap ml-2">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => NavigationContext.navigate({ page: "family-add-member" })}
            className="flex items-center justify-center w-full py-3 bg-[#FF8C42] text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加成员
          </button>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center justify-center w-full py-3 border-2 border-red-400 text-red-500 rounded-xl font-semibold active:scale-95 transition-transform"
          >
            <LogOut className="w-5 h-5 mr-2" />
            退出家庭
          </button>
        </div>
      </div>

      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2 text-[#2C3E50]">确认退出家庭？</h3>
            <p className="text-sm text-gray-600 mb-6">退出后你创建的内容将被删除，且无法恢复。</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold active:scale-95 transition-transform"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                }}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold active:scale-95 transition-transform"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
