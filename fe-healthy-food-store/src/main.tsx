import ReactDOM from "react-dom/client";
import "./index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import Main from "./layout/Main.tsx";
import HomePage from "./pages/HomePage.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from "./pages/AdminPage.tsx";
import "swiper/scss";
import "swiper/scss/scrollbar";
import "swiper/scss/pagination";
import "swiper/scss/navigation";
import DetailIngredientPage from "./pages/DetailIngredientPage.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import CartPage from "./pages/CartPage.tsx";
import DetailMealPage from "./pages/DetailMealPage.tsx";
import ManageIngredientPage from "./pages/ManageIngredientPage.tsx";
import ManageMealPage from "./pages/ManageMealPage.tsx";
import ManageUserPage from "./pages/ManageUserPage.tsx";
import IngredientsPage from "./pages/IngredientsPage.tsx";
import MealsPage from "./pages/MealsPage.tsx";
import TDEEPage from "./pages/TDEEPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import InforUserPage from "./pages/InforUserPage.tsx";
import ChangeInforUserPage from "./pages/ChangeInforUserPage.tsx";
import ChangePasswordUserPage from "./pages/ChangePasswordUserPage.tsx";
import FillEmail from "./pages/FillEmail.tsx";
import FillNewPassword from "./pages/FillNewPassword.tsx";
import TDEEResultPage from "./pages/TDEEResultPage.tsx";
import DietRecommendPage from "./pages/DietRecommendPage.tsx";
import ManageOrderPage from "./pages/ManageOrderPage.tsx";
import HistoryOrderUserPage from "./pages/HistoryOrderUserPage.tsx";
import PrivateRoute from "./Routes/PrivateRoute.tsx";
import PaymentResult from "./pages/PaymentResult.tsx";
import MealsRecommendPage from "./pages/MealsRecommendPage.tsx";
import ManageStatisticalPage from "./pages/ManageStatisticalPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "ingredient/:iid",
        element: <DetailIngredientPage />,
      },
      {
        path: "payment-result",
        element: <PaymentResult />,
      },
      {
        path: "fillemail",
        element: <FillEmail />,
      },
      {
        path: "reset-password/:tokenpassword",
        element: <FillNewPassword />,
      },
      {
        path: "cart",
        element: (
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        ),
      },
      {
        path: "user",
        element: (
          <PrivateRoute>
            <InforUserPage />
          </PrivateRoute>
        ),
        children: [
          {
            path: "/user/history-order",
            element: <HistoryOrderUserPage />,
          },
          {
            path: "/user/change-infor",
            element: <ChangeInforUserPage />,
          },
          {
            path: "/user/change-password",
            element: <ChangePasswordUserPage />,
          },
        ],
      },
      {
        path: "checkout",
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: "ingredients",
        element: <IngredientsPage />,
      },
      {
        path: "meals",
        element: <MealsPage />,
      },
      {
        path: "meal/:mid",
        element: <DetailMealPage />,
      },
      {
        path: "recommend-meals",
        element: <MealsRecommendPage />,
      },
      {
        path: "tdee-calculator",
        element: <TDEEPage />,
      },
      {
        path: "tdee-calculator/result",
        element: <TDEEResultPage />,
      },
      {
        path: "diet-recommend",
        element: <DietRecommendPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <AdminPage />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/statistical",
        element: <ManageStatisticalPage />,
      },
      {
        path: "/dashboard/orders",
        element: <ManageOrderPage />,
      },
      {
        path: "/dashboard/ingredients",
        element: <ManageIngredientPage />,
      },
      {
        path: "/dashboard/meals",
        element: <ManageMealPage />,
      },
      {
        path: "/dashboard/users",
        element: <ManageUserPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer autoClose={1000} />
  </Provider>
);
