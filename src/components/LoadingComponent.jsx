import React from 'react'
import { Loader2 } from "lucide-react";

function LoadingComponent({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Loader2 className="animate-spin h-10 w-10 text-travelmate-blue mx-auto mb-4" />
        <p className="text-gray-600">
          {message || "Loading..."}
        </p>
      </div>
    </div>
  )
}

export default LoadingComponent