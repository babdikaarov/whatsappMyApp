import { X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface LoadingStateProps {
   totalRecivers: number;
   sent: number;
   failed: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ totalRecivers, sent, failed }) => {
   const { progressOpen, setProgressOpen } = useAppStore();
   const total = totalRecivers || 1;
   const completed = sent + failed;
   const requestProgress = Math.round((completed / total) * 100);
   const successProgress = Math.round((sent / total) * 100);
   const failedProgress = Math.round((failed / total) * 100);

   return (
      <div
         className={`overflow-hidden transition-all relative duration-700 ease-in-out mt-3.5 ${
            !progressOpen ? "max-h-[0px]" : "max-h-[600px]"
         }`}
      >
         <div className="border-green-600 border-2 ">
            <button
               className="absolute right-2 top-2 btn btn-xs"
               disabled={totalRecivers !== sent + failed}
               onClick={() => setProgressOpen(!progressOpen)}
            >
               <X />
            </button>
            <div className="flex flex-wrap justify-center gap-8 p-6 bg-base-100 rounded-xl shadow-lg">
               {/* Request Process */}
               <div className="flex flex-col items-center">
                  <div
                     className="radial-progress text-primary"
                     style={{ "--value": requestProgress, "--thickness": "8px" } as React.CSSProperties}
                     role="progressbar"
                  >
                     {requestProgress}%
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700">Request Process</span>
               </div>

               {/* Successful Sent */}
               <div className="flex flex-col items-center">
                  <div
                     className="radial-progress text-success"
                     style={{ "--value": successProgress, "--thickness": "6px" } as React.CSSProperties}
                     role="progressbar"
                  >
                     {sent}/{total}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700">Successful</span>
               </div>

               {/* Failed Sent */}
               <div className="flex flex-col items-center">
                  <div
                     className="radial-progress text-error"
                     style={{ "--value": failedProgress, "--thickness": "6px" } as React.CSSProperties}
                     role="progressbar"
                  >
                     {failed}/{total}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700">Failed</span>
               </div>
            </div>
         </div>
      </div>
   );
};

export default LoadingState;
