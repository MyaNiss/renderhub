import {createBrowserRouter} from "react-router";
import Layout from "../pages/Layout.jsx";
import BoardList from "../pages/board/BoardList.jsx";
import HomePage from "../pages/HomePage.jsx";
import BoardWrite from "../pages/board/BoardWrite.jsx";
import BoardDetail from "../pages/board/BoardDetail.jsx";
import BoardUpdate from "../pages/board/BoardUpdate.jsx";
import CustomerServiceList from "../pages/customerservice/CustomerServiceList.jsx";
import CustomerServiceDetail from "../pages/customerservice/CustomerServiceDetail.jsx";
import CustomerServiceWrite from "../pages/customerservice/CustomerServiceWrite.jsx";
import CustomerServiceUpdate from "../pages/customerservice/CustomerServiceUpdate.jsx";
import UserProfile from "../pages/user/UserProfile.jsx";
import UserProfileUpdate from "../pages/user/UserProfileUpdate.jsx";
import UserPage from "../pages/user/UserPage.jsx";
import TransactionBuy from "../pages/transaction/TransactionBuy.jsx";
import OrderHistory from "../pages/transaction/OrderHistory.jsx";
import OrderDetail from "../pages/transaction/OrderDetail.jsx";

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <HomePage />,
                },
                {
                    path: '/user',
                    children: [
                        {
                            path: 'page/:targetUserId',
                            element: <UserPage />
                        },
                        {
                            path: 'profile',
                            element: <UserProfile />
                        },
                        {
                            path: 'profile/update',
                            element: <UserProfileUpdate />
                        }
                    ]
                },
                {
                    path: '/transaction',
                    children: [
                        {
                            path: 'list',
                            element: <OrderHistory />
                        },
                        {
                            path: ':id',
                            element: <OrderDetail/>
                        },
                        {
                            path: 'buy',
                            element: <TransactionBuy />
                        }
                    ]
                },
                {
                    path: '/board',
                    children: [
                        {
                            index: true,
                            element: <BoardList />,
                        },
                        {
                            path: 'write',
                            element: <BoardWrite/>
                        },
                        {
                            path: ':id',
                            element: <BoardDetail/>
                        },
                        {
                            path: 'update/:id',
                            element: <BoardUpdate/>
                        }
                    ]
                },
                {
                    path: '/cs',
                    children: [
                        {
                            index: true,
                            element: <CustomerServiceList/>
                        },
                        {
                            path: 'write',
                            element: <CustomerServiceWrite/>
                        },
                        {
                            path: ':id',
                            element: <CustomerServiceDetail/>
                        },
                        {
                            path: 'update/:id',
                            element: <CustomerServiceUpdate/>
                        }
                    ]
                }
            ]
        }
    ]
)