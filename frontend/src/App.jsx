import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RouterProvider} from "react-router";
import {router} from "./router/router.jsx";
import './App.css';
import 'react-quill-new/dist/quill.snow.css';

//react-query 설정
const queryClient = new QueryClient(
    {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnMount: true,
          retry: 1,
          staleTime : 6000,
          gcTime: 6000
        }
      },
    }
)

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
    </>
  )
}

export default App
