import { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { NavigationContext } from "../App";

const mockSummary = [
  {
    id: 1,
    dish: "红烧肉",
    count: 3,
    members: [
      { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom", count: 1 },
      { name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad", count: 1 },
      { name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me", count: 1 },
    ],
  },
  {
    id: 2,
    dish: "清蒸鱼",
    count: 2,
    members: [
      { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom", count: 1 },
      { name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother", count: 1 },
    ],
  },
  {
    id: 3,
    dish: "炒青菜",
    count: 4,
    members: [
      { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom", count: 1 },
      { name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad", count: 1 },
      { name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother", count: 1 },
      { name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me", count: 1 },
    ],
  },
];

export function OrderSummaryPage() {
  const [expandedDish, setExpandedDish] = useState<number | null>(null);

  const toggleExpand = (dishId: number) => {
    setExpandedDish(expandedDish === dishId ? null : dishId);
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
        <h1 className="text-lg font-bold text-[#2C3E50]">点餐汇总</h1>
      </div>

      <div className="p-4 space-y-3">
        {mockSummary.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleExpand(item.id)}
              className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center flex-1">
                <h3 className="font-semibold text-[#2C3E50] mr-3">{item.dish}</h3>
                <span className="px-3 py-1 bg-[#FF8C42] bg-opacity-10 text-[#FF8C42] rounded-full text-sm font-medium">
                  {item.count} 份
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-2">
                  {item.members.slice(0, 3).map((member, idx) => (
                    <img
                      key={idx}
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                  {item.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +{item.members.length - 3}
                    </div>
                  )}
                </div>
                {expandedDish === item.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedDish === item.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-3 space-y-2">
                  {item.members.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <span className="text-sm text-[#2C3E50]">{member.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{member.count} 份</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
