import { ChevronLeft } from "lucide-react";
import { NavigationContext } from "../App";

const mockMyReviews = [
  {
    id: 1,
    targetType: "衣橱",
    targetTitle: "白色T恤",
    content: "这件衣服很好看，适合夏天穿！",
    time: "2024-04-19 14:30",
  },
  {
    id: 2,
    targetType: "菜单",
    targetTitle: "红烧肉",
    content: "味道很棒，下次还想吃！",
    time: "2024-04-19 12:00",
  },
  {
    id: 3,
    targetType: "事务",
    targetTitle: "洗碗",
    content: "洗得很干净！",
    time: "2024-04-18 18:00",
  },
];

export function MyReviewsPage() {
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
        <h1 className="text-lg font-bold text-[#2C3E50]">我的评价</h1>
      </div>

      <div className="p-4 space-y-3">
        {mockMyReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium mr-2 ${getTypeColor(
                  review.targetType
                )}`}
              >
                {review.targetType}
              </span>
              <span className="text-sm font-medium text-[#2C3E50]">
                {review.targetTitle}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{review.content}</p>
            <p className="text-xs text-gray-400">{review.time}</p>
          </div>
        ))}

        {mockMyReviews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-center">暂无评价记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
