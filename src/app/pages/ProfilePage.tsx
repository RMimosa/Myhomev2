import { MessageSquare, ChevronRight, Settings } from "lucide-react";
import { NavigationContext } from "../App";

export function ProfilePage() {
  const user = {
    name: "我",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me",
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-white rounded-b-3xl shadow-sm p-6 mb-4">
        <div className="flex items-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h1 className="text-xl font-bold text-[#2C3E50]">{user.name}</h1>
            <p className="text-sm text-gray-500">家庭成员</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <button
          onClick={() => NavigationContext.navigate({ page: "profile-reviews" })}
          className="flex items-center justify-between w-full bg-white rounded-xl p-4 shadow-sm active:scale-95 transition-transform"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#FF8C42] bg-opacity-10 rounded-full flex items-center justify-center mr-3">
              <MessageSquare className="w-5 h-5 text-[#FF8C42]" />
            </div>
            <span className="text-[#2C3E50] font-medium">我的评价</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm opacity-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-gray-400 font-medium">设置</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
