import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { NavigationContext } from "../App";

const mockFamilyMembers = [
  { id: 1, name: "妈妈", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mom" },
  { id: 2, name: "爸爸", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dad" },
  { id: 3, name: "哥哥", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brother" },
  { id: 4, name: "我", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me" },
];

export function PublishTaskPage() {
  const [taskName, setTaskName] = useState("");
  const [assignee, setAssignee] = useState<number | null>(null);

  const handlePublish = () => {
    if (!taskName.trim()) {
      toast.error("请输入家务名称");
      return;
    }
    if (assignee === null) {
      toast.error("请选择负责人");
      return;
    }
    toast.success("家务发布成功！");
    NavigationContext.navigate({ page: "home" });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-white shadow-sm p-4 flex items-center">
        <button
          onClick={() => NavigationContext.goBack()}
          className="mr-3 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-[#2C3E50]" />
        </button>
        <h1 className="text-lg font-bold text-[#2C3E50]">发布家务</h1>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
            家务名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value.slice(0, 20))}
            placeholder="请输入家务名称（最多20字）"
            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:outline-none text-[#2C3E50]"
            maxLength={20}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{taskName.length}/20</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
            负责人 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {mockFamilyMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setAssignee(member.id)}
                className={`flex items-center w-full p-4 rounded-xl transition-all ${
                  assignee === member.id
                    ? "bg-[#FF8C42] bg-opacity-10 border-2 border-[#FF8C42]"
                    : "bg-white border-2 border-transparent"
                }`}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span
                  className={`font-medium ${
                    assignee === member.id ? "text-[#FF8C42]" : "text-[#2C3E50]"
                  }`}
                >
                  {member.name}
                </span>
                {assignee === member.id && (
                  <div className="ml-auto w-6 h-6 bg-[#FF8C42] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-[393px] mx-auto">
        <button
          onClick={handlePublish}
          disabled={!taskName.trim() || assignee === null}
          className="w-full py-4 bg-[#FF8C42] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          发布家务
        </button>
      </div>
    </div>
  );
}
