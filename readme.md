# Docs
License is [MIT](https://mit-license.org/). Do what you want with this I dont care as long as you dont bother me.

**IF YOU FIND ANY ISSUES CREATE A GITHUB ISSUE @ github/ffamilyfriendly/persist_interval**

## how to init this 
create a instance of the manager

### like this
```js
const _m = require("persistent-interval.js")
const manager = new _m(param1, param2, param3) //this is the instance
```
#### what are param1, param2, or param 3?
* **param1:** save path. Honestly just stick to "./"
* **param2:** how often to save persistent data (in MS). Keep at something sane like every minute (1000 * 60)
* **param3:** callback that is ran whenever manager is ready. If any function is called before this only false will be returned

## how do I set a interval/timeouts

### like this
```js
manager.setInterval("intervalName",() => {console.log("interval")},5000) //ran every 5 seconds
manager.setTimeout("timeoutName",() => {console.log("timeout")},5000) //ran just once in 5 seconds

//remember:
//running setInterval or setTimeout before manager is initialised will just return false and wont work.
//Make sure manager is initialised 
```

## working example
```js
const Manager = require("./persistent-interval.js")

const hello = () => {
    console.log(`Hello!`)
}

const m = new Manager("./",1000 * 60,() => {
    console.log("Hello! I will greet you every hour starting now\n")
    m.setInterval("greetings",hello,1000 * 60 * 60)

    console.log("I will say hello to you tommorow!")
    m.setTimeout("cya",hello,1000 * 60 * 24)
})
```