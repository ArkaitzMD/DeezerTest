import ReactDOM from "react-dom/client";
import App from "./App";
import './styles/App.css'
import { ApolloProvider } from "@apollo/client";
import client from "./API/apolloClient";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ApolloProvider client={client}>
      <App />
  </ApolloProvider>
);
