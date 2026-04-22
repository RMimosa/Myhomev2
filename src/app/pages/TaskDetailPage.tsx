import { useState } from "react";
import { ChevronLeft, ThumbsUp, MessageSquare, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { NavigationContext } from "../App";

const mockTask = {
  id: 1,
  name: "洗碗",
  description: "晚餐后清洗所有餐具",
  assignee: { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom", id: 1 },
  publisher: { name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad", id: 2 },
  publishTime: "2024-04-19 10:30",
  completed: false,
};

const mockReviews = [
  { id: 1, user: "爸爸", content: "洗得很干净！", time: "1小时前" },
];

const mockFamilyMembers = [
  { id: 1, name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
  { id: 2, name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
  { id: 3, name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
];

export function TaskDetailPage({ id }: { id: string }) {
  const [showRecommend, setShowRecommend] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [completed, setCompleted] = useState(mockTask.completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(mockTask.name);
  const [editedDescription, setEditedDescription] = useState(mockTask.description);

  const currentUserId = 2; // 当前用户是发布者
  const isAssignee = currentUserId === mockTask.assignee.id;
  const isPublisher = currentUserId === mockTask.publisher.id;

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

  const handleComplete = () => {
    setCompleted(true);
    toast.success("家务已标记为完成！");
    setShowComplete(false);
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
    setEditedName(mockTask.name);
    setEditedDescription(mockTask.description);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      <div className="bg-white shadow-sm p-4 flex items-center mb-4">
        <button
          onClick={() => NavigationContext.goBack()}
          className="mr-3 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-[#2C3E50]" />
        </button>
        <h1 className="text-lg font-bold text-[#2C3E50]">家务详情</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value.slice(0, 20))}
                  className="w-full text-xl font-bold text-[#2C3E50] border-b-2 border-[#FF8C42] focus:outline-none mb-2"
                  placeholder="家务名称"
                  maxLength={20}
                />
              ) : (
                <h2 className="text-xl font-bold text-[#2C3E50] mb-2">{editedName}</h2>
              )}

              {isEditing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value.slice(0, 100))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF8C42] text-sm text-gray-600 resize-none"
                  placeholder="家务描述（最多100字）"
                  rows={2}
                  maxLength={100}
                />
              ) : (
                <p className="text-sm text-gray-600">{editedDescription}</p>
              )}
            </div>

            <div className="flex flex-col items-end space-y-2 ml-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  completed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {completed ? "已完成" : "待完成"}
              </span>

              {isPublisher && (
                <div className="flex space-x-2">
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
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 w-20">负责人:</span>
              <div className="flex items-center">
                <img
                  src={mockTask.assignee.avatar}
                  alt={mockTask.assignee.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm text-[#2C3E50] font-medium">
                  {mockTask.assignee.name}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-600 w-20">发布人:</span>
              <div className="flex items-center">
                <img
                  src={mockTask.publisher.avatar}
                  alt={mockTask.publisher.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm text-[#2C3E50] font-medium">
                  {mockTask.publisher.name}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-600 w-20">发布时间:</span>
              <span className="text-sm text-[#2C3E50]">{mockTask.publishTime}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-[#2C3E50] mb-3">评价</h3>
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

        {isAssignee && !completed && (
          <button
            onClick={() => setShowComplete(true)}
            className="w-full py-4 bg-green-500 text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
          >
            标记为完成
          </button>
        )}
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
        </div>
      </div>

      {showComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2 text-[#2C3E50]">确认完成？</h3>
            <p className="text-sm text-gray-600 mb-6">确认已完成该家务任务吗？</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowComplete(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-semibold active:scale-95 transition-transform"
              >
                取消
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold active:scale-95 transition-transform"
              >
                确认完成
              </button>
            </div>
          </div>
        </div>
      )}

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
