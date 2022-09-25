import { Server } from "socket.io";
import { api } from "./genkidama/src/api";
import { details } from "./genkidama/src/details"
let _io;

function onconnect(socket) {
    console.log("connected")
    socket.on("open", onopen);
    socket.on("close", onclose);
    socket.on("disconnect", ondisconnect);
}

function ondisconnect(reason) {
    console.log(`disconnected:${reason}`);
}

function onopen(data) {
    if (!_io) return;
    const { pair, id } = data;
    if (!id) return;
    //position取得
    api("positions", { "params": { "symbol": pair }, "keys": ["list"] })
        .then(robj => {
            if (robj) {
                //detail更新＆送信
                details.update(pair, robj);
                _io.emit("add position", { "pair": pair, "position": robj });
            }
        })
        .catch(e => console.trace(e));
}

/**決済時*/
function onclose(data) {
    if (!_io) return;
    const { pair, id } = data;
    if (!id) return;
    //detail更新＆送信
    details.remove(pair, id);
    _io.emit("remove position", data);
}

function socketHandler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server)
        res.socket.server.io = io;
        _io = io;
        _io.on("connection", onconnect);
    }
    res.end()
}

export default socketHandler;

export const config = {
    api: {
        bodyParser: false,
    }
};