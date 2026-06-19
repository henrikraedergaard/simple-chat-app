# Homework

## Getting started

1. Run `docker compose up`
2. Open http://localhost:80

## Message protocol

Messages between signaling server and client are done via websockets and is fully type-safe. See `web/src/types/ws-message.ts` for the type definitions.

Messages between clients use peer-connection and are fully typed. Types live in `web/src/types/chat-message.ts`.

## Architecture

I chose option B as that sounded more interesting and complex. This architecture also aliviates more stress on the server and makes operational costs lower.

## Time spent

I have spent about 16 hours on this project. I have never made a chat app or used p2p web rtc technology before so it took some time to understand the implementation. Also was very fun so used a bit more time than planned.

## Reflection

### Trade-offs

- No message history or syncing in case the user rejoins the chat

### Known issues

- Poor error-handling.
- Deleting messages does sometimes not work as intended.
- Users are given new ids when they leave and rejoin.
- Large number of messages causes lag and memory leak

### Future improvements

- No custom names, making the UI look quite cluttered with the long UUIDs
- Improve UI spacing and sizing to match the mockup designs better
- Make the state and connection setup less tightly coupled to improve testing, readability and reuseability

## Testing strategy

Testing is done using vitest and playwright. Had limited time at the end to implement tests so decided to do integration tests.
