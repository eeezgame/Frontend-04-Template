
const { log } = require("console")
const net = require("net")

class Request {
    constructor(options){
        this.method = options.method || "GET"
        this.host = options.host
        this.port = options.port || 80
        this.path = options.path || "/"
        this.body = options.body || {}
        this.headers = options.headers || {}
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded"
        }

        if(this.headers["Content-Type"] === 'application/json'){
            this.bodyText = JSON.stringify(this.body)
        } else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded"){
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
        }
        this.headers["Content-Length"] = this.bodyText.length
    }

    send(connection){
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if(connection){
                connection.write(this.toString())
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                },() => {
                    connection.write(this.toString())
                })
            }
            connection.on('data', (data) =>{
                console.log(data.toString());
                parser.receive(data.toString())
                if(parser.isFinished) {
                    resolve(parser.response)
                    connection.end()
                }
            })
            connection.on('error', (err) =>{
                console.log(err);
                connection.end()
            })
            // resolve("")
        })
    }

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }
}

class ResponseParser {
    constructor(){
        // this.WAITING_STATUS_LINE = 0
        // this.WAITING_STATUS_LINE_END = 1
        // this.WAITING_HEADER_NAME = 2
        // this.WAITING_HEADER_SPACE = 3
        // this.WAITING_HEADER_VALUE = 4
        // this.WAITING_HEADER_LINE_END = 5
        // this.WAITING_HEADER_BLOCK_END = 6
        // this.WAITING_BODY = 7

        this.current = this.WAITING_STATUS_LINE
        this.statusLine = ""
        this.headers = {}
        this.headerName = ""
        this.headerValue = ""
        this.bodyParser = null
    }

    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished
    }

    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    receive(string){
        for(let i = 0; i < string.length; i++){
            this.receiveChar(string.charAt(i))
        }
    }
    
    receiveChar(char){
        this.current !== this.EOF && (this.current = this.current(char))
    }

    WAITING_STATUS_LINE(c){
        if(c === '\r'){
            return this.WAITING_STATUS_LINE_END
        } else{
            this.statusLine += c
            return this.WAITING_STATUS_LINE
        }
    }

    WAITING_STATUS_LINE_END(c){
        if(c === '\n'){
            return this.WAITING_HEADER_NAME
        } else{
            return this.WAITING_STATUS_LINE_END
        }
    }

    WAITING_HEADER_NAME(c){
        if(c === ':'){
            return this.WAITING_HEADER_SPACE
        } else if(c === '\r'){
            if((this.headers['Transfer-Encoding'] === 'chunked')){
                this.bodyParser = new TrunkedBodyParser()
            }
            return this.WAITING_HEADER_BLOCK_END
        } else {
            this.headerName += c
            return this.WAITING_HEADER_NAME
        }
    }

    WAITING_HEADER_SPACE(c){
        if(c === ' '){
            return this.WAITING_HEADER_VALUE
        } else{
            return this.WAITING_HEADER_SPACE
        }
    }

    WAITING_HEADER_VALUE(c){
        if(c === '\r'){
            this.headers[this.headerName] = this.headerValue
            this.headerName = ''
            this.headerValue = ''
            return this.WAITING_HEADER_LINE_END
        } else {
            this.headerValue += c
            return this.WAITING_HEADER_VALUE
        }
    }

    WAITING_HEADER_LINE_END(c){
        if(c === '\n'){
            return this.WAITING_HEADER_NAME
        } else {
            return this.WAITING_HEADER_LINE_END
        }
    }

    WAITING_HEADER_BLOCK_END(c){
        if(c === '\n'){
            return this.WAITING_BODY
        } else {
            return this.WAITING_HEADER_BLOCK_END
        }
    }

    WAITING_BODY(c){
        this.bodyParser.receiveChar(c)
        return this.WAITING_BODY
    }

}

class TrunkedBodyParser {
    constructor() {
        this.length = 0
        this.content = []
        this.isFinished = false
        this.current = this.WAITING_LENGTH
    }
    
    receive(string){
        for(let i = 0; i < string.length; i++){
            this.receiveChar(string.charAt(i))
        }
    }
    
    receiveChar(char){
        this.current !== this.EOF && (this.current = this.current(char))
    }

    WAITING_LENGTH(c){
        if(c === '\r'){
            if(this.length === 0){
                this.isFinished = true
                return this.EOF
            } else {
                return this.WAITING_LENGTH_LINE_END
            }
        } else {
            this.length *= 16
            this.length += parseInt(c, 16)
            return this.WAITING_LENGTH
        }
    }

    WAITING_LENGTH_LINE_END(c){
        if(c === '\n'){
            return  this.READING_TRUNK
        } else {
            return this.WAITING_LENGTH_LINE_END
        }
    }

    READING_TRUNK(c){
        this.content.push(c)
        this.length --
        if(this.length === 0){
            return this.WAITING_NEW_LINE
        } else {
            return this.READING_TRUNK
        }
    }

    WAITING_NEW_LINE(c){
        if(c === '\r'){
           return this.WAITING_NEW_LINE_END
        } else {
            return this.WAITING_NEW_LINE
        }
    }

    WAITING_NEW_LINE_END(c){
        if(c === '\n'){
            return this.WAITING_LENGTH
        } else {
            return this.WAITING_NEW_LINE_END
        }
    }

    EOF(c){
        return this.EOF
    }
}
void async function (){
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers:{
            ["X-Foo"]: 'customed'
        },
        body:{
            name: "Runki"
        }
    })
    let response = await request.send()

    console.log(response);
}()