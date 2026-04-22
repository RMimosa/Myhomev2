import { useState } from "react";
import { ChevronLeft, ThumbsUp, MessageSquare, Bookmark, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { NavigationContext } from "../App";

const mockClothing = {
  id: 1,
  name: "白色T恤",
  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
  category: "上衣",
  description: "舒适百搭的基础款，适合日常穿搭",
  creator: { id: 4, name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me" },
};

const mockReviews = [
  { id: 1, user: "妈妈", content: "这件衣服很好看，适合夏天穿！", time: "2小时前" },
  { id: 2, user: "爸爸", content: "颜色很百搭", time: "5小时前" },
];

const mockFamilyMembers = [
  { id: 1, name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
  { id: 2, name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
  { id: 3, name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
];

export function ClothingDetailPage({ id }: { id: string }) {
  const [showRecommend, setShowRecommend] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(mockClothing.name);
  const [editedDescription, setEditedDescription] = useState(mockClothing.description);

  const currentUserId = 4;
  const isOwner = mockClothing.creator.id === currentUserId;

  const toggleMember = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleRecommend = () => {
    if (selectedMembers.length === 0) {
      toast.error("请选择推荐对象");
      return;
    }
    toast.success("推荐成功！");
    setShowRecommend(false);
    setSelectedMembers([]);
  };

  const handleReview = () => {
    if (!reviewText.trim()) {
      toast.error("请输入评价内容");
      return;
    }
    toast.success("评价成功！");
    setShowReview(false);
    setReviewText("");
  };

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error("名称不能为空");
      return;
    }
    toast.success("保存成功！");
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(mockClothing.name);
    setEditedDescription(mockClothing.description);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      <div className="relative">
        <img
          src={mockClothing.image}
          alt={mockClothing.name}
          className="w-full aspect-square object-cover"
        />
        <button
          onClick={() => NavigationContext.goBack()}
          className="absolute top-4 left-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-[#2C3E50]" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value.slice(0, 20))}
                className="flex-1 text-xl font-bold text-[#2C3E50] border-b-2 border-[#FF8C42] focus:outline-none"
                placeholder="衣物名称"
                maxLength={20}
              />
            ) : (
              <h1 className="text-xl font-bold text-[#2C3E50]">{editedName}</h1>
            )}
            {isOwner && (
              <div className="flex space-x-2 ml-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-8 h-8 bg-[#FF8C42] text-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value.slice(0, 100))}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF8C42] text-sm text-gray-600 resize-none"
              placeholder="商品描述（最多100字）"
              rows={3}
              maxLength={100}
            />
          ) : (
            <p className="text-sm text-gray-600 mb-3">{editedDescription}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {mockClothing.category}
            </span>
            <div className="flex items-center text-sm text-gray-600">
              <img
                src={mockClothing.creator.avatar}
                alt={mockClothing.creator.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span>{mockClothing.creator.name}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-[#2C3E50] mb-3">评价</h2>
          {mockReviews.length > 0 ? (
            <div className="space-y-3">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#2C3E50]">{review.user}</span>
                    <span className="text-xs text-gray-400">{review.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">暂无评价</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg max-w-[393px] mx-auto">
        <div className="flex items-center justify-around p-4">
          <button
            onClick={() => setShowRecommend(true)}
            className="flex flex-col items-center text-[#FF8C42] active:scale-95 transition-transform"
          >
            <ThumbsUp className="w-6 h-6 mb-1" />
            <span className="text-xs">推荐</span>
          </button>
          <button
            onClick={() => setShowReview(true)}
            className="flex flex-col items-center text-[#FF8C42] active:scale-95 transition-transform"
          >
            <MessageSquare className="w-6 h-6 mb-1" />
            <span className="text-xs">评价</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 active:scale-95 transition-transform">
            <Bookmark className="w-6 h-6 mb-1" />
            <span className="text-xs">收藏</span>
          </button>
        </div>
      </div>

      {showRecommend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4 text-[#2C3E50]">推荐给家庭成员</h3>
            <div className="space-y-3 mb-6">
              {mockFamilyMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-xl active:scale-95 transition-transform"
                >
                  <div className="flex items-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span className="text-[#2C3E50]">{member.name}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedMembers.includes(member.id)
                        ? "bg-[#FF8C42] border-[#FF8C42]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMembers.includes(member.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRecommend(false);
                  setSelectedMembers([]);
                }}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold active:scale-95 transition-transform"
              >
                取消
              </button>
              <button
                onClick={handleRecommend}
                className="flex-1 py-3 bg-[#FF8C42] text-white rounded-xl font-semibold active:scale-95 transition-transform"
              >
                确认推荐
              </button>
            </div>
          </div>
        </div>
      )}

      {showReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4 text-[#2C3E50]">写评价</h3>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value.slice(0, 100))}
              placeholder="分享你的看法..."
              className="w-full h-32 px-4 py-3 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2C3E50]"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{reviewText.length}/100</p>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowReview(false);
                  setReviewText("");
                }}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold active:scale-95 transition-transform"
              >
                取消
              </button>
              <button
                onClick={handleReview}
                className="flex-1 py-3 bg-[#FF8C42] text-white rounded-xl font-semibold active:scale-95 transition-transform"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
