const unirest=require('unirest');

const USER = process.env.WALLET_USER;
const PASS = process.env.WALLET_PASSWORD;

const headers = {
  "content-type": "text/plain;"
};


const getNewAddress=async ()=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getnewaddress","params":[]}`;
    const respond=await unirest.post(`http://${USER}:${PASS}@${process.env.WALLET_URL}:${process.env.WALLET_PORT}/`)
    .headers(headers).send(dataString);
    console.log(`http://${USER}:${PASS}@${process.env.WALLET_URL}:${process.env.WALLET_PORT}/`);
    console.log(`{"jsonrpc":"1.0","id":"curltext","method":"getnewaddress","params":[]}`);
    return respond;

};

const getTransaction=async (txid)=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"gettransaction","params":["${txid}"]}`;
    const respond=await unirest.post(`http://${USER}:${PASS}@${process.env.WALLET_URL}:${process.env.WALLET_PORT}/`)
    .headers(headers).send(dataString);
    return respond;

};

const sendToAddress=async (address, amount)=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"sendtoaddress","params":["${address}", "${amount}"]}`;
    console.log(dataString);
    const respond=await unirest.post(`http://${USER}:${PASS}@${process.env.WALLET_URL}:${process.env.WALLET_PORT}/`)
    .headers(headers).send(dataString);
    return respond;
}
const getTotalBalance=async (address, amount)=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getbalance","params":[]}`;
    console.log(dataString);
    const respond=await unirest.post(`http://${USER}:${PASS}@${process.env.WALLET_URL}:${process.env.WALLET_PORT}/`)
    .headers(headers).send(dataString);
    return respond;
}

module.exports={
    getNewAddress, getTransaction, sendToAddress, getTotalBalance
};