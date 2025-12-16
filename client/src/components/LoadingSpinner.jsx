export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-10 w-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}