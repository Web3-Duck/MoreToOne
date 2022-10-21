export const handleError = (callError: any) => {
  return callError.reason || callError.error?.message || callError.data?.message || callError.message;
};
