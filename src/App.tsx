import "./App.css";
import ToggleTheme from "./components/ToggleTheme";
import Contacts from "./components/Contacts";
import Message from "./components/Message";
import Alert from "./components/Alert";

function App() {
   return (
      <>
         <header className=" container navbar bg-base-100 flex justify-between">
            <a className="btn btn-link text-xl" target="_blank">
               Github repo 🔗
            </a>
            <ToggleTheme />
         </header>
         <div className="divider mt-1" />
         <main className="flex container">
            <section className="w-1/2">
               <Contacts />
            </section>
            <div className="divider divider-horizontal" />
            <section className="w-1/2">
               <Message />
            </section>
            <div className="absolute bottom-2 container">
               <Alert />
            </div>
         </main>
      </>
   );
}

export default App;
