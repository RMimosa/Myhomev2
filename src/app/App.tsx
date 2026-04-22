import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { FamilyPage } from "./pages/FamilyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AddClothingPage } from "./pages/AddClothingPage";
import { ClothingDetailPage } from "./pages/ClothingDetailPage";
import { PublishMenuPage } from "./pages/PublishMenuPage";
import { OrderSummaryPage } from "./pages/OrderSummaryPage";
import { PublishTaskPage } from "./pages/PublishTaskPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { AddMemberPage } from "./pages/AddMemberPage";
import { FamilyOrdersPage } from "./pages/FamilyOrdersPage";
import { MyReviewsPage } from "./pages/MyReviewsPage";
import { Home, Users, User } from "lucide-react";
import { Toaster, toast } from "sonner";

export type Route =
  | { page: "home" }
  | { page: "family" }
  | { page: "profile" }
  | { page: "clothing-add" }
  | { page: "clothing-detail"; id: string }
  | { page: "menu-publish" }
  | { page: "menu-summary" }
  | { page: "tasks-publish" }
  | { page: "task-detail"; id: string }
  | { page: "family-add-member" }
  | { page: "family-orders" }
  | { page: "profile-reviews" };

export const NavigationContext = {
  navigate: (route: Route) => {},
  goBack: () => {},
  currentRoute: { page: "home" } as Route,
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>({ page: "home" });
  const [routeHistory, setRouteHistory] = useState<Route[]>([{ page: "home" }]);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    setRouteHistory([...routeHistory, route]);
  };

  const goBack = () => {
    if (routeHistory.length > 1) {
      const newHistory = routeHistory.slice(0, -1);
      setRouteHistory(newHistory);
      setCurrentRoute(newHistory[newHistory.length - 1]);
    }
  };

  NavigationContext.navigate = navigate;
  NavigationContext.goBack = goBack;
  NavigationContext.currentRoute = currentRoute;

  const navItems = [
    { route: { page: "home" as const }, icon: Home, label: "主页" },
    { route: { page: "family" as const }, icon: Users, label: "家庭中心" },
    { route: { page: "profile" as const }, icon: User, label: "我的" },
  ];

  const isActive = (page: string) => {
    return currentRoute.page === page;
  };

  const renderPage = () => {
    switch (currentRoute.page) {
      case "home":
        return <HomePage />;
      case "family":
        return <FamilyPage />;
      case "profile":
        return <ProfilePage />;
      case "clothing-add":
        return <AddClothingPage />;
      case "clothing-detail":
        return <ClothingDetailPage id={currentRoute.id} />;
      case "menu-publish":
        return <PublishMenuPage />;
      case "menu-summary":
        return <OrderSummaryPage />;
      case "tasks-publish":
        return <PublishTaskPage />;
      case "task-detail":
        return <TaskDetailPage id={currentRoute.id} />;
      case "family-add-member":
        return <AddMemberPage />;
      case "family-orders":
        return <FamilyOrdersPage />;
      case "profile-reviews":
        return <MyReviewsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFF8F0] max-w-[393px] mx-auto">
      <main className="flex-1 overflow-y-auto pb-16">
        {renderPage()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.route.page);
            return (
              <button
                key={item.route.page}
                onClick={() => navigate(item.route)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active ? "text-[#FF8C42]" : "text-gray-500"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" strokeWidth={2} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <Toaster />
    </div>
  );
}
