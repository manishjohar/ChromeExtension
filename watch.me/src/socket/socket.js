import openSocket from "socket.io-client";

const socket = openSocket('http://localhost:5000');
console.log("socket details => ", socket);
socket.on('connect', () => console.log("connection established"));

const socketResponse = callBack => {
    socket.on('watchMeResponse-123', response => {
        console.log(response);
        return callBack(response);
    });
}


const socketRequest = requestData => {
    socket.emit('watchMeRequest', requestData, data => alert(data));
}

const socketRequestOff = () => {
    socket.off("res");
}
export { socketRequest, socketResponse, socketRequestOff };