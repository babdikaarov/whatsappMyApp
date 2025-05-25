import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

const Alert: React.FC = () => {
   const { setAlertActive, alertFailed, alertText, alertActive } = useAppStore();

   useEffect(() => {
      if (!alertActive) return;

      const timeout = setTimeout(() => {
         setAlertActive(false);
      }, 5000);

      return () => clearTimeout(timeout);
   }, [alertActive, setAlertActive]);

   if (!alertActive) return null;

   return alertFailed ? (
      <div role="alert" className="alert alert-error">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
         </svg>
         <span>{alertText}</span>
      </div>
   ) : (
      <div role="alert" className="alert alert-success">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
         </svg>
         <span>{alertText}</span>
      </div>
   );
};

export default Alert;
