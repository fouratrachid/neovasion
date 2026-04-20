import { useMutation, useQueryClient } from "@tanstack/react-query";
import { networkingService } from "@/services/networkingService";
import { queryKeys } from "@/hooks/queryKeys";

export const useNetworkingActions = () => {
    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: ({ postId, message, replyTo }: { postId: string; message: string; replyTo?: string | null }) =>
            networkingService.addComment(postId, message, replyTo),
        onSuccess: (newComment, variables) => {
            // Invalidate activity to refresh feeds
            queryClient.invalidateQueries({ queryKey: queryKeys.networking.activity() });

            // If there's a specific post detail query to invalidate in the future, add it here
            // queryClient.invalidateQueries({ queryKey: ["postDetail", variables.postId] });
        },
    });

    const addLikeMutation = useMutation({
        mutationFn: (postId: string) => networkingService.addLike(postId),
        onMutate: async (postId) => {
            // Optimistic update for activity feed
            await queryClient.cancelQueries({ queryKey: queryKeys.networking.activity() });
            const previousData = queryClient.getQueryData(queryKeys.networking.activity());

            queryClient.setQueryData(queryKeys.networking.activity(), (old: any) => {
                if (!old || !old.posts) return old;
                return {
                    ...old,
                    posts: old.posts.map((post: any) =>
                        post._id === postId
                            ? { ...post, is_like: true, nbLikes: (post.nbLikes || 0) + 1 }
                            : post
                    ),
                };
            });

            return { previousData };
        },
        onError: (err, postId, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKeys.networking.activity(), context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.networking.activity() });
        },
    });

    const removeLikeMutation = useMutation({
        mutationFn: (postId: string) => networkingService.removeLike(postId),
        onMutate: async (postId) => {
            // Optimistic update for activity feed
            await queryClient.cancelQueries({ queryKey: queryKeys.networking.activity() });
            const previousData = queryClient.getQueryData(queryKeys.networking.activity());

            queryClient.setQueryData(queryKeys.networking.activity(), (old: any) => {
                if (!old || !old.posts) return old;
                return {
                    ...old,
                    posts: old.posts.map((post: any) =>
                        post._id === postId
                            ? { ...post, is_like: false, nbLikes: Math.max((post.nbLikes || 1) - 1, 0) }
                            : post
                    ),
                };
            });

            return { previousData };
        },
        onError: (err, postId, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKeys.networking.activity(), context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.networking.activity() });
        },
    });

    return {
        addComment: addCommentMutation.mutateAsync,
        isAddingComment: addCommentMutation.isPending,
        addLike: addLikeMutation.mutate,
        removeLike: removeLikeMutation.mutate,
        isAddingLike: addLikeMutation.isPending,
        isRemovingLike: removeLikeMutation.isPending,
    };
};
