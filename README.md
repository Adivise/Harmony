## 🎗 READ ME PLEASE
- THIS BOT HAVE CLIENT INSIDE!
- COMMAND `!stop & !skip` WORK WHEN RUN WITH `Start.bat`
- YOU CAN CONTROL VOLUME IN VOLUME MIXER (Program call name cmdmp3.exe)

## 📑 Short Feature
- [x] Music (Support Youtube Only!)
- [x] Client Inside!
- [x] Easy to use!

## 🚨 Have a Problem

✈ Join Discord:  [NanoSpace ♪♪](https://discord.gg/SNG3dh3MbR)
   mention me in chat #general or #javascript and ask problem okay! 👌

## 📎 Requirements

1. Node.js v16+ **[Download](https://nodejs.org/en/download/)**
2. TMI Oauth **[Click Here](https://twitchapps.com/tmi/)**
3. MongaDB **[Download](https://www.mongodb.com/try/download/community)** (Download & install = Finish!)

## 📚 Installation

```
git clone https://github.com/Adivise/Harmony
cd Harmony
npm install
```

After installation finishes you can use `node .` to start the bot. or `Run Start.bat`

## 📄 Configuration

Copy or Rename `.env.example` to `.env` and fill out the values:

```.env
# Bot
PREFIX=!
OWNER=nanotect_

# Channel
CHANNEL=nanotect_
USERNAME=adivise
OAUTH=oauth:12316456445

# Database
MONGO_URI=mongodb://127.0.0.1:27017/harmony
```

## 🔩 Features & Commands

> Note: The default prefix is '!'

> Your can settings all in Folder `Settings`

> Optional: [] | Required: ()

💫 **Music Commands!** 
- `!play (link)` - Play music form youtube (only support! yt link!)
- `!stop` - Stop music and clear queue
- `!skip` - Skip music to next song
- `!clearqueue` - Clearqueue in bot

🤖 **Dev Commands!** (Work Only Owner!)
- `!clearcache` - Delete all mp3 file in cache  
- `!cleardatabase` - Delete all database in bot (use on bot getting stuck song, on start bot!) 
- `!cmdenable` - Enable & Disable | Play Command!


## 📝 Credits
Developed by [Adivise](https://github.com/Adivise)
