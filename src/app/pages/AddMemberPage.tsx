import { useState } from "react";
import { ChevronLeft, Search, QrCode } from "lucide-react";
import { toast } from "sonner";
import { NavigationContext } from "../App";

export function AddMemberPage() {
  const [searchValue, setSearchValue] = useState("");
  const [showQR, setShowQR] = useState(false);

  const handleSearch = () => {
    if (!searchValue.trim()) {
      toast.error("请输入手机号或账号");
      return;
    }
    toast.success("邀请已发送！");
    setSearchValue("");
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
        <h1 className="text-lg font-bold text-[#2C3E50]">添加成员</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-[#2C3E50] mb-4">搜索添加</h2>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="输入手机号或账号"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-[#2C3E50]"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-[#FF8C42] text-white rounded-xl font-semibold active:scale-95 transition-transform"
            >
              搜索
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-[#2C3E50] mb-4">扫码添加</h2>
          <p className="text-sm text-gray-600 mb-4">
            让对方扫描二维码，即可加入家庭
          </p>
          <button
            onClick={() => setShowQR(true)}
            className="w-full py-3 border-2 border-[#FF8C42] text-[#FF8C42] rounded-xl font-semibold flex items-center justify-center active:scale-95 transition-transform"
          >
            <QrCode className="w-5 h-5 mr-2" />
            显示二维码
          </button>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            💡 提示：新成员加入后，可以一起管理衣橱、点餐和家务
          </p>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4 text-[#2C3E50] text-center">
              扫码加入家庭
            </h3>
            <div className="bg-gray-100 aspect-square rounded-xl flex items-center justify-center mb-4">
              <div className="w-48 h-48 bg-white p-4 rounded-lg">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="white" />
                  <g fill="black">
                    <rect x="10" y="10" width="5" height="5" />
                    <rect x="20" y="10" width="5" height="5" />
                    <rect x="30" y="10" width="5" height="5" />
                    <rect x="10" y="20" width="5" height="5" />
                    <rect x="30" y="20" width="5" height="5" />
                    <rect x="10" y="30" width="5" height="5" />
                    <rect x="20" y="30" width="5" height="5" />
                    <rect x="30" y="30" width="5" height="5" />
                    <rect x="65" y="10" width="5" height="5" />
                    <rect x="75" y="10" width="5" height="5" />
                    <rect x="85" y="10" width="5" height="5" />
                    <rect x="65" y="20" width="5" height="5" />
                    <rect x="85" y="20" width="5" height="5" />
                    <rect x="65" y="30" width="5" height="5" />
                    <rect x="75" y="30" width="5" height="5" />
                    <rect x="85" y="30" width="5" height="5" />
                    <rect x="10" y="65" width="5" height="5" />
                    <rect x="20" y="65" width="5" height="5" />
                    <rect x="30" y="65" width="5" height="5" />
                    <rect x="10" y="75" width="5" height="5" />
                    <rect x="30" y="75" width="5" height="5" />
                    <rect x="10" y="85" width="5" height="5" />
                    <rect x="20" y="85" width="5" height="5" />
                    <rect x="30" y="85" width="5" height="5" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mb-6">
              对方扫描此二维码即可加入
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full py-3 bg-[#FF8C42] text-white rounded-xl font-semibold active:scale-95 transition-transform"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
