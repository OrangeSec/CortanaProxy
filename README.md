CortanaProxy
============

Server for intercepting Cortana's requests (Windows Phone 8.1)

Home automation demo: https://www.youtube.com/watch?v=iJgrQ9AUDdc

# How to

### Setup the nodejs server

- Install the dependencies:
```
$ npm install
```

- Start the server (root):
```
# npm start
```

### Windows Phone setup
- Set DNS server with your local IP (you can see it from the program output).
  - Skip this if you set the domain redirect on your router.
- Go to http://www.bing.com:8888/ and install the certificate as asked.
- Ready to go!


### Messing with the conf.json

| Key     | Value              |
| ------- | ------------------ |
| keyword | Word to say        |
| answer  | Cortana's response |
| exec    | Command to execute |
