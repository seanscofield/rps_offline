# Elemental Balls

This is a POC for building a browser-based game using phaser.io (v3). It is in it's _very_ early stages.

### How to run it

Unfortunately, the index.html file in this repo needs to be served from a web server (that way it's javascript code can load the images from the assets folder without breaking Access-Origin rules or whatever). You can technically do this any way you want, but the way _I've been doing it_ is by using a nodejs _http-server_. I installed it using this command:

```
npm install http-server -g
```

and am running it with this command:

```
npx http-server
```

Once you've got that running, you can simply navigate to http://127.0.0.1:8081 to play the game.

### Gameplay

Currently, all that happens when you load the game in your browser is that you can move a circle by moving your mouse (similar to agar.io or slither.io). There's also another ball that you can collide with.

### Open issues/questions

Things I've struggled with in the code so far are:
1. The v3 phaser.io documentation can be tough to read
2. Making sure that the size of each game-object's collider is the same as the size of that object's image is tougher than I expected. I have it working correctly for _one_ of the images in the assets folder, but if I switch to using the other image, I can't seem to get it to work no matter how much I mess with the code.



