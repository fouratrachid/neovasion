import { useMutation } from '@tanstack/react-query';
import { hosterService, HosterRequestPayload, HosterRequestResponse } from '@/services/hosterService';

export const useHosterRequest = () => {
  const mutation = useMutation<HosterRequestResponse, Error, HosterRequestPayload>({
    mutationFn: (payload: HosterRequestPayload) =>
      hosterService.submitHosterRequest(payload),
    onSuccess: (data) => {
      console.log('✅ useHosterRequest: Request submitted successfully', data._id);
    },
    onError: (error) => {
      console.error('❌ useHosterRequest: Submission failed', error.message);
    },
  });

  return {
    submitRequest: mutation.mutate,
    submitRequestAsync: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};
