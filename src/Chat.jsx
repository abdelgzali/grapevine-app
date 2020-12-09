import React, { useState, useRef, useEffect } from "react";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  useMutation,
} from "@apollo/client";
import ls from "local-storage";

const client = new ApolloClient({
  uri: "https://grapvine-api.herokuapp.com/",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  query {
    messages {
      grape
      content
    }
  }
`;

const POST_MESSAGE = gql`
  # mutation postMessage($grape:String!, $content:String!) {
  #   postMessage(grape: $grape, content: $content)
  # }
  mutation postMessage($grape: String!, $content: String!) {
    postMessage(grape: $grape, content: $content) {
      grape
      content
    }
  }
`;

const Messages = ({ user }) => {
  const scrollRef = useRef(null);
  const { data } = useQuery(GET_MESSAGES);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const messagesArr = data ? data.messages : [];

  return (
    <div id="messages">
      {messagesArr.length > 0 &&
        messagesArr.map((message, index) => {
          return (
            <div
              key={index}
              className={message.grape === user ? "this-user" : ""}
            >
              <h5>{message.grape}</h5>
              <p>{message.content}</p>
            </div>
          );
        })}
      <div ref={scrollRef}></div>
    </div>
  );
};

const Chat = () => {
  const [chatState, setChatState] = useState({
    grape: ls("local-user") ? ls("local-user") : "",
    content: "",
  });
  console.log(chatState.grape);
  const [postMessage] = useMutation(POST_MESSAGE);

  const onEnter = () => {
    if (chatState.content.length > 0) {
      postMessage({
        variables: chatState,
      });
    }
    setChatState({
      ...chatState,
      content: "",
    });
  };

  const handleUser = (user) => {
    if (user.length > 0) {
      console.log(user);
      ls("local-user", user);
      setChatState({
        ...chatState,
        grape: ls("local-user"),
      });
    }
  };

  return (
    <div>
      <Messages user={chatState.grape} />
      <div id="chat-inputs">
        <input
          type="text"
          value={chatState.grape}
          placeholder="your name?"
          onChange={(e) => handleUser(e.target.value)}
        />
        <input
          type="text"
          value={chatState.content}
          placeholder="Message (press enter to send)"
          onChange={(e) =>
            setChatState({
              ...chatState,
              content: e.target.value,
            })
          }
          onKeyUp={(e) => {
            if (e.key === "Enter") onEnter();
          }}
        />
      </div>
    </div>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
