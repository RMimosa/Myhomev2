import { useState } from "react";
import { Plus, CheckCircle2, Share2 } from "lucide-react";
import { NavigationContext } from "../App";
import { toast } from "sonner";

const categories = ["全部", "上衣", "下装", "套装", "饰品", "鞋子"];

const mockClothingItems = [
  { id: 1, name: "白色T恤", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", category: "上衣", description: "舒适百搭的基础款" },
  { id: 2, name: "牛仔裤", image: "https://images.unsplash.com/photo-1542272454315-7d0ab2915d0a?w=300&h=300&fit=crop", category: "下装", description: "经典蓝色牛仔裤" },
  { id: 3, name: "连衣裙", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop", category: "套装", description: "优雅夏日连衣裙" },
  { id: 4, name: "运动鞋", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", category: "鞋子", description: "舒适运动鞋" },
];

const mockFamilyMembers = [
  { id: 1, name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
  { id: 2, name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
  { id: 3, name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
];

export function WardrobeContent() {
  const [activeTab, setActiveTab] = useState<"mine" | "others">("mine");
  const [selectedMember, setSelectedMember] = useState(mockFamilyMembers[0]);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [bottomTab, setBottomTab] = useState<"list" | "selected" | "recommend">("list");
  const [showRecommendModal, setShowRecommendModal] = useState(false);

  const currentUserId = 4; // 当前用户ID
  const isViewingOthers = activeTab === "others";

  const filteredItems = mockClothingItems.filter(
    item => selectedCategory === "全部" || item.category === selectedCategory
  );

  const toggleSelectItem = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleRecommend = () => {
    if (selectedItems.length === 0) {
      toast.error("请先选择衣物");
      return;
    }

    if (isViewingOthers) {
      toast.success(`已推荐给${selectedMember.name}！`);
    } else {
      setShowRecommendModal(true);
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-white shadow-sm pb-6">
        <div className="pt-4 px-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab("mine")}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeTab === "mine"
                  ? "bg-[#FF8C42] text-white font-semibold"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              我的衣橱
            </button>
            <button
              onClick={() => setActiveTab("others")}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeTab === "others"
                  ? "bg-[#FF8C42] text-white font-semibold"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              他人衣橱
            </button>
          </div>

          {activeTab === "others" && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {mockFamilyMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setSelectedMember(member);
                    setSelectedItems([]);
                    setBottomTab("list");
                  }}
                  className={`flex flex-col items-center min-w-[70px] p-2 rounded-lg transition-all ${
                    selectedMember.id === member.id ? "bg-[#FFF8F0]" : ""
                  }`}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className={`w-12 h-12 rounded-full mb-1 ${
                      selectedMember.id === member.id ? "ring-2 ring-[#FF8C42]" : ""
                    }`}
                  />
                  <span className="text-xs text-[#2C3E50]">{member.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 左侧分类导航 */}
      <div className="px-4 pt-4">
        <div className="flex space-x-2 overflow-x-auto pb-3">
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

      <div className="p-4">
        {activeTab === "mine" && (
          <button
            onClick={() => NavigationContext.navigate({ page: "clothing-add" })}
            className="flex items-center justify-center w-full py-3 mb-4 bg-[#FF8C42] text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加衣物
          </button>
        )}

        {bottomTab === "list" && (
          <>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => NavigationContext.navigate({ page: "clothing-detail", id: String(item.id) })}
                      className="bg-white rounded-xl overflow-hidden shadow-md active:scale-95 transition-transform text-left w-full"
                    >
                      <div className="aspect-square bg-gray-100 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedItems.includes(item.id) && (
                          <div className="absolute inset-0 bg-[#FF8C42] bg-opacity-30 flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-[#2C3E50] truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectItem(item.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                    >
                      {selectedItems.includes(item.id) ? (
                        <CheckCircle2 className="w-5 h-5 text-[#FF8C42]" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-center">该分类暂无衣物</p>
              </div>
            )}
          </>
        )}

        {bottomTab === "selected" && (
          <div className="space-y-3">
            {selectedItems.length > 0 ? (
              selectedItems.map((itemId) => {
                const item = mockClothingItems.find((i) => i.id === itemId);
                if (!item) return null;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-md flex items-center space-x-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2C3E50]">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-center">暂未选择衣物</p>
              </div>
            )}
          </div>
        )}

        {bottomTab === "recommend" && (
          <div className="flex flex-col items-center justify-center py-20">
            <Share2 className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-400 mb-6">
              {isViewingOthers
                ? `将选中的 ${selectedItems.length} 件衣物推荐给${selectedMember.name}`
                : `已选择 ${selectedItems.length} 件衣物`}
            </p>
            <button
              onClick={handleRecommend}
              disabled={selectedItems.length === 0}
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
            {selectedItems.length > 0 && (
              <span className="absolute top-2 right-12 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedItems.length}
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
                    setSelectedItems([]);
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
    </div>
  );
}
