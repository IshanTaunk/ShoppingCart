import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface TanstackProviderProps {
    children: React.ReactNode
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1 * 1000,
            refetchOnWindowFocus: true,
        },
        mutations: {
            retry: 0,
        },
    }
});

export const TanstackProvider = ({children}: TanstackProviderProps) => {
    return <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
}