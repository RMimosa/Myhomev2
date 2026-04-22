import { useState } from "react";
import { toast } from "sonner";
import { NavigationContext } from "../App";
import { Share2 } from "lucide-react";

const categories = ["全部", "主食", "饮品", "外卖"];

const mockMenu = {
  id: 1,
  title: "周二晚餐",
  dishes: [
    { id: 1, name: "红烧肉", category: "主食", description: "香浓美味" },
    { id: 2, name: "清蒸鱼", category: "主食", description: "鲜嫩可口" },
    { id: 3, name: "炒青菜", category: "主食", description: "清爽健康" },
    { id: 4, name: "番茄蛋汤", category: "饮品", description: "营养丰富" },
    { id: 5, name: "麻辣烫", category: "外卖", description: "外卖热门" },
  ],
};

const mockFamilyMembers = [
  { id: 1, name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
  { id: 2, name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
  { id: 3, name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
];

export function MenuContent() {
  const [selectedDishes, setSelectedDishes] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [bottomTab, setBottomTab] = useState<"list" | "selected" | "recommend">("list");
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const isAdmin = true;
  const hasMenu = true;

  const filteredDishes = mockMenu.dishes.filter(
    dish => selectedCategory === "全部" || dish.category === selectedCategory
  );

  const toggleDish = (dishId: number) => {
    setSelectedDishes((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  };

  const handleConfirmOrder = () => {
    toast.success("点餐成功！");
    setShowConfirm(false);
    setSelectedDishes([]);
    setBottomTab("list");
  };

  const handleRecommend = () => {
    if (selectedDishes.length === 0) {
      toast.error("请先选择菜品");
      return;
    }
    setShowRecommendModal(true);
  };

  if (!hasMenu) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-4">
        <p className="text-gray-400 mb-6">暂无菜单，等待管理员发布～</p>
        {isAdmin && (
          <button
            onClick={() => NavigationContext.navigate({ page: "menu-publish" })}
            className="px-6 py-3 bg-[#FF8C42] text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
          >
            发布菜单
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="bg-white shadow-sm p-6 mb-4">
        <h2 className="text-xl font-bold text-[#2C3E50] mb-2">{mockMenu.title}</h2>
        <p className="text-sm text-gray-500">请选择您想吃的菜品</p>
      </div>

      {/* 左侧分类导航 */}
      <div className="px-4 pb-3">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-[#FF8C42] text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {bottomTab === "list" && (
          <>
            {filteredDishes.map((dish) => (
              <button
                key={dish.id}
                onClick={() => toggleDish(dish.id)}
                className="flex items-center justify-between w-full p-4 bg-white rounded-xl shadow-sm active:scale-95 transition-transform"
              >
                <div className="flex-1 text-left">
                  <p className="text-[#2C3E50] font-medium">{dish.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{dish.description}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ml-3 ${
                    selectedDishes.includes(dish.id)
                      ? "bg-[#FF8C42] border-[#FF8C42]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedDishes.includes(dish.id) && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </>
        )}

        {bottomTab === "selected" && (
          <div className="space-y-3">
            {selectedDishes.length > 0 ? (
              selectedDishes.map((dishId) => {
                const dish = mockMenu.dishes.find((d) => d.id === dishId);
                if (!dish) return null;
                return (
                  <div
                    key={dish.id}
                    className="bg-white rounded-xl p-4 shadow-md"
                  >
                    <h3 className="font-semibold text-[#2C3E50]">{dish.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{dish.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{dish.category}</p>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-center">暂未选择菜品</p>
              </div>
            )}
          </div>
        )}

        {bottomTab === "recommend" && (
          <div className="flex flex-col items-center justify-center py-20">
            <Share2 className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-400 mb-6">已选择 {selectedDishes.length} 道菜品</p>
            <button
              onClick={handleRecommend}
              disabled={selectedDishes.length === 0}
              className="px-8 py-3 bg-[#FF8C42] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              确认推荐
            </button>
          </div>
        )}
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-16 left-0 right-0 max-w-[393px] mx-auto bg-white border-t shadow-lg">
        <div className="flex items-center justify-around h-14">
          <button
            onClick={() => setBottomTab("list")}
            className={`flex-1 h-full flex items-center justify-center font-medium transition-colors ${
              bottomTab === "list" ? "text-[#FF8C42] border-t-2 border-[#FF8C42]" : "text-gray-500"
            }`}
          >
            列表
          </button>
          <button
            onClick={() => setBottomTab("selected")}
            className={`flex-1 h-full flex items-center justify-center font-medium transition-colors relative ${
              bottomTab === "selected" ? "text-[#FF8C42] border-t-2 border-[#FF8C42]" : "text-gray-500"
            }`}
          >
            已选
            {selectedDishes.length > 0 && (
              <span className="absolute top-2 right-12 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedDishes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setBottomTab("recommend")}
            className={`flex-1 h-full flex items-center justify-center font-medium transition-colors ${
              bottomTab === "recommend" ? "text-[#FF8C42] border-t-2 border-[#FF8C42]" : "text-gray-500"
            }`}
          >
            推荐
          </button>
        </div>
      </div>

      {/* 推荐给家庭成员弹窗 */}
      {showRecommendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4 text-[#2C3E50]">推荐给家庭成员</h3>
            <div className="space-y-3 mb-6">
              {mockFamilyMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    toast.success(`已推荐给${member.name}！`);
                    setShowRecommendModal(false);
                    setSelectedDishes([]);
                    setBottomTab("list");
                  }}
                  className="flex items-center w-full p-3 bg-gray-50 rounded-xl active:scale-95 transition-transform"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="text-[#2C3E50] font-medium">{member.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRecommendModal(false)}
              className="w-full py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold active:scale-95 transition-transform"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4 text-[#2C3E50]">确认点餐</h3>
            <div className="mb-6 space-y-2">
              {selectedDishes.map((dishId) => {
                const dish = mockMenu.dishes.find((d) => d.id === dishId);
                return (
                  <div key={dishId} className="text-[#2C3E50]">
                    • {dish?.name}
                  </div>
                );
              })}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold active:scale-95 transition-transform"
              >
                取消
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 py-3 bg-[#FF8C42] text-white rounded-xl font-semibold active:scale-95 transition-transform"
              >
                确认点餐
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
