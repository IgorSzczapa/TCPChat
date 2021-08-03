class User {
    constructor(name,connect) {
        this.name = name
        this.connect = connect
    }
}

class Room {
    constructor(name) {
        this.name = name
        this.welcome
        this.users = []
    }
}

let rooms = []

const broadcast = (room,msg) =>
    room.users.forEach(u => u.connect.write(' > '+msg+'\n'))

require('net').createServer((connect) => {

    connect.setEncoding('utf-8')

    let me, room

    let regStatus = 0, menu

    connect.write(
        '\n > You\'re welcome!'+
        '\n > Enter your nickname and press enter : '
    )

    connect.on('data',(data) => {
        data = data.replace('\r\n','')
        switch(regStatus) {
            case 0: {
                me = new User(data,connect)
                connect.write(
                    '\n > Choose one option :'+
                    '\n > 1. Join to The Room'+
                    '\n > 2. Create your own room\n'
                )
                regStatus++
            break }
            case 1: {
                menu = Number(data)
                connect.write('\n > Pass name of The Room and press enter : ')
                regStatus++
            break }
            case 2: {
                switch(menu) {
                    case 1: {
                        room = rooms.find(r => r.name === data)
                        if(!room) {
                            connect.write('\n > Pass name of The Room and press enter : ')
                            return
                        }
                        room.users.push(me)
                        console.log(me.name+' join to '+room.name)
                    break }
                    case 2: {
                        room = new Room(data)
                        room.users.push(me)
                        rooms.push(room)
                        console.log(room.name+' has been created')
                    break }
                    default: {
                        break } }
                me.connect.write('\n > You\'re welcome!\n')
                broadcast(room,me.name+' is new member of '+room.name+'\n')
                regStatus++
            break }
            case 3: {
                broadcast(room,me.name+' : '+data)
            break } }
    })

    // that is not work
    connect.on('close',() => {
        broadcast(room,me.name+' leaves The Room')
        //delete room.users.find(u => u === me).connect
        console.log(me.name+' leaves '+room.name)
    })

}).listen(3000,console.log('listenig')).timeout = 0