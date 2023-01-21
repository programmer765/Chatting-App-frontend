import "./App.css";
import Chat from "./Components/Chat/Chat";
import Login from "./Components/Login/Login";
import Sidebar from "./Components/Sidebar/Sidebar";
import { useDataLayerValue } from "./DataLayer/DataLayer";

function App() {
  const [{ user }] = useDataLayerValue();

  return (
    <div className="app">
      {user ? (
        <div className="app_body">
          <Sidebar />
          <Chat />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
