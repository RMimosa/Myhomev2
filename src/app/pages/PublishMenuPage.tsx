import { useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { NavigationContext } from "../App";

export function PublishMenuPage() {
  const [title, setTitle] = useState("");
  const [dishes, setDishes] = useState<string[]>([""]);
  const [currentDish, setCurrentDish] = useState("");

  const addDish = () => {
    if (!currentDish.trim()) {
      toast.error("请输入菜品名称");
      return;
    }
    setDishes([...dishes, currentDish]);
    setCurrentDish("");
  };

  const removeDish = (index: number) => {
    setDishes(dishes.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!title.trim()) {
      toast.error("请输入菜单标题");
      return;
    }
    const validDishes = dishes.filter((d) => d.trim());
    if (validDishes.length === 0) {
      toast.error("请至少添加一道菜品");
      return;
    }
    toast.success("菜单发布成功！");
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
        <h1 className="text-lg font-bold text-[#2C3E50]">发布菜单</h1>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
            菜单标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 20))}
            placeholder="如：周二晚餐（最多20字）"
            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:outline-none text-[#2C3E50]"
            maxLength={20}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/20</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
            菜品列表 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2 mb-3">
            {dishes.map((dish, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={dish}
                  onChange={(e) => {
                    const newDishes = [...dishes];
                    newDishes[index] = e.target.value;
                    setDishes(newDishes);
                  }}
                  placeholder="输入菜品名称"
                  className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:outline-none text-[#2C3E50]"
                />
                <button
                  onClick={() => removeDish(index)}
                  className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentDish}
              onChange={(e) => setCurrentDish(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addDish()}
              placeholder="输入菜品名称"
              className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:outline-none text-[#2C3E50]"
            />
            <button
              onClick={addDish}
              className="px-4 h-[50px] bg-[#FF8C42] text-white rounded-xl font-medium active:scale-95 transition-transform"
            >
              添加
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-[393px] mx-auto">
        <button
          onClick={handlePublish}
          disabled={!title.trim()}
          className="w-full py-4 bg-[#FF8C42] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          发布菜单
        </button>
      </div>
    </div>
  );
}
