import "./App.css";
import ToggleTheme from "./components/ToggleTheme";
import Contacts from "./components/Contacts";
import Message from "./components/Message";
import Alert from "./components/Alert";

function App() {
   return (
      <>
         <header className=" container navbar bg-base-100 flex justify-between">
            <a
               className="btn btn-link text-xl"
               target="_blank"
               href="https://github.com/babdikaarov/whatsappMyApp?tab=readme-ov-file#whatsapp-message-sender-app"
            >
               Github repo 🔗
            </a>
            <ToggleTheme />
         </header>
         <div className="divider mt-1" />
         <main className="flex container flex-col md:flex-row">
            <section className="md:w-1/2 ">
               <Contacts />
            </section>
            <div className="divider md:divider-horizontal divider-vertical" />
            <section className="md:w-1/2">
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
