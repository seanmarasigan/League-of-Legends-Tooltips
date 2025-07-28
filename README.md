# League-of-Legends-Tooltips

This repository is the foundation for a **Twitch extension** designed to make League of Legends streams more interactive and educational. The extension allows viewers to click directly on the stream overlay to access **real-time details** about the ongoing match — including **champion items**, **abilities**, **summoner spells**, **runes**, and **masteries**.

---

## Requirements

### System Requirements
- Node.js (v18+ recommended)
- Python 3.8+
- League of Legends client (must be running in an active game)
- Twitch Developer account (for deploying extensions — optional during local dev)

### Node Dependencies
- `ws` (WebSocket server)

Install with:

```bash
npm install
```

### Python Dependencies
- `requests`

Install with:

```bash
pip install -r requirements.txt
```

## Getting Started

1. Clone the repository
    ```bash
    git clone https://github.com/your-username/League-of-Legends-Tooltips.git
    cd League-of-Legends-Tooltips
    ```

2. Install dependencies
    ```bash
    npm install
    pip install -r requirements.txt
    ```

3. Run the dev server
    ```bash
    npm run start
    ```

4. Open your browser
    
    Go to: [http://localhost:3000](http://localhost:3000)  
    You’ll see a basic interface that updates in real time with match data pulled from the League of Legends client.


## How it Works
- The Python script polls Riot's Live Client API:
    ```bash
    https://127.0.0.1:2999/liveclientdata/allgamedata
    ```
    and sends real-time game data to Node.js via stdout.

- The Node.js server captures that data, relays it to frontend clients through WebSocket.
- The Twitch extension frontend (coming soon) will visualize this data in an overlay for viewers to interact with.


## Goals
- Enable stream viewers to:
    - See real-time tooltips: items, skills, spells, and runes
    - Learn and interact with ongoing gameplay in meaningful ways


## Author
Built by **Sean Andrei Marasigan** ([shun](https://github.com/shun))  
Contributions, ideas, and pull requests are welcome!