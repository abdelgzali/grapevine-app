import React, { useState, useRef, useEffect } from "react";

import {
  ApolloProvider,
  useQuery,
  gql,
  useMutation,
  useSubscription,
} from "@apollo/client";
import client from "./ApolloClient/client.js";
import ls from "local-storage";

const GET_MESSAGES = gql`
  query {
    messages {
      grape
      content
    }
  }
`;

const POST_MESSAGE = gql`
  mutation postMessage($grape: String!, $content: String!) {
    postMessage(grape: $grape, content: $content) {
      grape
      content
    }
  }
`;

const MESSAGES_SUBSCRIPTION = gql`
  subscription {
    newMessage {
      grape
      content
    }
  }
`;

const Messages = ({ user, messageAdded }) => {
  const scrollRef = useRef(null);
  const { data: messages } = useQuery(GET_MESSAGES);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const messagesArr = messages ? messages.messages : [];
  if (messageAdded) messagesArr.push(messageAdded);

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
  const [postMessage] = useMutation(POST_MESSAGE);
  const { data: messageAdded } = useSubscription(MESSAGES_SUBSCRIPTION);

  useEffect(() => {
    console.log(messageAdded);
  }, [messageAdded]);

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
      ls("local-user", user);
      setChatState({
        ...chatState,
        grape: ls("local-user"),
      });
    }
  };

  return (
    <div>
      <Messages user={chatState.grape} messageAdded={messageAdded} />
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
