const fs = require("fs")
const version = [1,0,0]

class Manager {
    /**
     * 
     * @param {String} persistent_path the path for the persistent data to be saved at
     * @param {Number} timeout how often the persistent date shall be saved
     * @param {Function} onInit callback function that is ran when Manager is initialized 
     */
    async constructor(persistent_path = "./", timeout = 1000 * 60, onInit = () => {}) {
        this._refferences = {  }
        this._data = {}
        this._queued_data = { intervals:[], timeouts:[] }
        this.initialised = false
        if(!fs.existsSync(`${persistent_path}interval_data.json`)) {
            fs.appendFileSync(`${persistent_path}interval_data.json`,`{ "info":"version: ${version.join(".")}   |   by github/ffamilyfriendly", "intervals":{}, "timeouts":{} }`)
        }

        fs.readFile(`${persistent_path}interval_data.json`,( err, data ) => {
            if(err) throw err
            else {
                this._data = JSON.parse(data.toString())
                this.initialised = true
                onInit()
                setInterval(() => {
                    fs.writeFileSync(`${persistent_path}interval_data.json`,JSON.stringify(this._data))
                }, timeout)
            }
        })
    }

    _dev_dump() {
        return this._data
    }

    _setInterval(name, callback, time) {
        const intervals = this._data.intervals
        this._refferences[`interval_${name}`] = setInterval(() => {
            //update
            intervals[name].next = Date.now() + time

            //call the passed function
            callback()
        },time)
    }

    /**
     * 
     * @param {String} name the id of this interval
     * @param {Function} callback the function ran when the timer is reached
     * @param {Number} time how often the function shall be ran (in milliseconds)
     */
    setInterval(name,callback,time) {
        if(!this.initialised) return false
        if(this._data.intervals[name]) {
            setTimeout(() => {
                callback()
                this._setInterval(name,callback,time)
            }, this._data.intervals[name].next - Date.now())
        } else {
            this._data.intervals[name] = { next: Date.now() + time }
            this._setInterval(name,callback,time)
        }
    }

    clearInterval(name) {
        if(!this.initialised) return false
        if(this._refferences[`interval_${name}`]) clearInterval(this._refferences[`interval_${name}`])
        if(this._data.intervals[name]) delete this._data.intervals[name]
    }

    /**
     * 
     * @param {String} name the id of this timeout
     * @param {Function} callback the function ran when the timer is reached
     * @param {Number} time when the function shall be ran (in milliseconds)
     */
    setTimeout(name,callback,time) {
        if(!this.initialised) return false
        this._refferences[`timeout_${name}`] = setTimeout(callback,time)
        if(this._data.timeouts[name]) {
            setTimeout(() => {
                callback()
                this.clearTimeout(name)
            }, this._data.timeouts[name].next - Date.now())
        } else {
            this._data.timeouts[name] = { next: Date.now() + time }
            this._refferences[`timeout_${name}`] = setTimeout(callback,time)
        }
    }

    clearTimeout(name) {
        if(!this.initialised) return false
        if(this._refferences[`timeout_${name}`]) clearTimeout(this._refferences[`timeout_${name}`])
        if(this._data.timeouts[name]) delete this._data.timeouts[name]
    }
}

module.exports = Manager