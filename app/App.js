import { LoginProvider } from "./contexts/LoginContext";
import MainStack from "./navigations/MainStack";
import { ApolloProvider } from "@apollo/client";
import client from "./configs/apolloConnection";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";
library.add(faXTwitter);

export default function App() {
  return (
    <ApolloProvider client={client}>
      <LoginProvider>
        <MainStack />
      </LoginProvider>
    </ApolloProvider>
  );
}
