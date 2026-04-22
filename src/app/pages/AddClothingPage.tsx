import { useState } from "react";
import { Camera, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { NavigationContext } from "../App";

export function AddClothingPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const categories = ["上衣", "裤子", "裙子", "其他"];

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("请输入衣物名称");
      return;
    }
    toast.success("添加成功！");
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
        <h1 className="text-lg font-bold text-[#2C3E50]">添加衣物</h1>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
            衣物名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder="请输入名称（最多20字）"
            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#FF8C42] focus:outline-none text-[#2C3E50]"
            maxLength={20}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{name.length}/20</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C3E50] mb-2">图片</label>
          <div className="w-full aspect-square bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF8C42] transition-colors">
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <>
                <Camera className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">点击上传图片</span>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C3E50] mb-2">分类</label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-3 rounded-xl font-medium transition-all ${
                  category === cat
                    ? "bg-[#FF8C42] text-white"
                    : "bg-white text-[#2C3E50] border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-[393px] mx-auto">
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-4 bg-[#FF8C42] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          保存
        </button>
      </div>
    </div>
  );
}
