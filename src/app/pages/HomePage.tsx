import { useState } from "react";
import { WardrobeContent } from "../components/WardrobeContent";
import { MenuContent } from "../components/MenuContent";
import { TasksContent } from "../components/TasksContent";

export function HomePage() {
  const [activeTab, setActiveTab] = useState<"wardrobe" | "menu" | "tasks">("wardrobe");

  const tabs = [
    { id: "wardrobe" as const, label: "衣橱" },
    { id: "menu" as const, label: "菜单" },
    { id: "tasks" as const, label: "家庭事务" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 font-semibold transition-all relative ${
                activeTab === tab.id
                  ? "text-[#FF8C42]"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#FF8C42] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-4">
        {activeTab === "wardrobe" && <WardrobeContent />}
        {activeTab === "menu" && <MenuContent />}
        {activeTab === "tasks" && <TasksContent />}
      </div>
    </div>
  );
}
