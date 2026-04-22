import { useState } from "react";
import { Plus, CheckCircle2, Share2 } from "lucide-react";
import { NavigationContext } from "../App";
import { toast } from "sonner";

const categories = ["全部", "厨房", "卫生间", "卧室", "客厅", "餐厅"];

const mockTasks = [
  {
    id: 1,
    name: "洗碗",
    assignee: { name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
    completed: false,
    category: "厨房",
    description: "晚餐后清洗餐具"
  },
  {
    id: 2,
    name: "倒垃圾",
    assignee: { name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
    completed: false,
    category: "客厅",
    description: "清理客厅垃圾"
  },
  {
    id: 3,
    name: "拖地",
    assignee: { name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
    completed: true,
    category: "卧室",
    description: "清洁卧室地板"
  },
  {
    id: 4,
    name: "清洁马桶",
    assignee: { name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me" },
    completed: false,
    category: "卫生间",
    description: "清洁卫生间"
  },
];

const mockFamilyMembers = [
  { id: 1, name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
  { id: 2, name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
  { id: 3, name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
];

export function TasksContent() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [bottomTab, setBottomTab] = useState<"list" | "selected" | "recommend">("list");
  const [showRecommendModal, setShowRecommendModal] = useState(false);

  const filteredTasks = mockTasks.filter(
    task => selectedCategory === "全部" || task.category === selectedCategory
  );

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const toggleSelectTask = (taskId: number) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleRecommend = () => {
    if (selectedTasks.length === 0) {
      toast.error("请先选择家务");
      return;
    }
    setShowRecommendModal(true);
  };

  return (
    <div className="pb-32">
      <div className="bg-white shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#2C3E50]">家庭事务</h2>
          <button
            onClick={() => NavigationContext.navigate({ page: "tasks-publish" })}
            className="w-10 h-10 bg-[#FF8C42] rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6 text-white" strokeWidth={2} />
          </button>
        </div>
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

      <div className="p-4 space-y-4">
        {bottomTab === "list" && (
          <>
            {activeTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3 px-2">进行中</h3>
                <div className="space-y-3">
                  {activeTasks.map((task) => (
                    <div key={task.id} className="relative">
                      <button
                        onClick={() => NavigationContext.navigate({ page: "task-detail", id: String(task.id) })}
                        className="block w-full bg-white rounded-xl p-4 shadow-sm active:scale-95 transition-transform text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#2C3E50] mb-1">{task.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span>{task.assignee.name}</span>
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium ml-3">
                            待完成
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectTask(task.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                      >
                        {selectedTasks.includes(task.id) ? (
                          <CheckCircle2 className="w-5 h-5 text-[#FF8C42]" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3 px-2">已完成</h3>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => NavigationContext.navigate({ page: "task-detail", id: String(task.id) })}
                      className="block w-full bg-gray-50 rounded-xl p-4 shadow-sm opacity-60 active:scale-95 transition-transform text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-500 mb-2 line-through">{task.name}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span>{task.assignee.name}</span>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          已完成
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-center">该分类暂无家务任务</p>
              </div>
            )}
          </>
        )}

        {bottomTab === "selected" && (
          <div className="space-y-3">
            {selectedTasks.length > 0 ? (
              selectedTasks.map((taskId) => {
                const task = mockTasks.find((t) => t.id === taskId);
                if (!task) return null;
                return (
                  <div key={task.id} className="bg-white rounded-xl p-4 shadow-md">
                    <h3 className="font-semibold text-[#2C3E50]">{task.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span>{task.assignee.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{task.category}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-center">暂未选择家务</p>
              </div>
            )}
          </div>
        )}

        {bottomTab === "recommend" && (
          <div className="flex flex-col items-center justify-center py-20">
            <Share2 className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-400 mb-6">已选择 {selectedTasks.length} 项家务</p>
            <button
              onClick={handleRecommend}
              disabled={selectedTasks.length === 0}
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
            {selectedTasks.length > 0 && (
              <span className="absolute top-2 right-12 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedTasks.length}
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
                    setSelectedTasks([]);
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
