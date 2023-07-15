let port;
let connectButton;
let baudRate;
let log;
let input;
let sendButton;
let register;
let value;
let sendRegValButton;

document.addEventListener("DOMContentLoaded", setup);

async function setup() {
    connectButton = document.querySelector('#connect');
    disconnectButton = document.querySelector('#disconnect');
    baudRate = document.querySelector('#baudrate');
    log = document.querySelector('#log');
    input = document.querySelector('#input');
    sendButton = document.querySelector('#send');
    register = document.querySelector('#register');
    value = document.querySelector('#value');
    sendRegValButton = document.querySelector('#sendRegVal');

    connectButton.addEventListener('click', connectBtnClick);
    disconnectButton.addEventListener('click', disconnectBtnClick);
    sendButton.addEventListener('click', sendBtnClick);
    sendRegValButton.addEventListener('click', sendRegValBtnClick);

    if ('serial' in navigator) {
        connectButton.disabled = false;
    } else {
        log.textContent = 'Web Serial API not supported by this browser.';
    }
}

async function connectBtnClick() {
    port = await navigator.serial.requestPort({});
    await port.open({ baudRate: parseInt(baudRate.value) });

    connectButton.disabled = true;
    disconnectButton.disabled = false;
    input.disabled = false;
    sendButton.disabled = false;
    register.disabled = false;
    value.disabled = false;
    sendRegValButton.disabled = false;

    while (port.readable) {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                log.textContent += value + '\n';
            }
        } catch (error) {
            log.textContent = `Read error: ${error}`;
        } finally {
            reader.releaseLock();
        }
    }
}

async function disconnectBtnClick() {
    if (port) {
        await port.close();
        port = null;

        connectButton.disabled = false;
        disconnectButton.disabled = true;
        input.disabled = true;
        sendButton.disabled = true;
        register.disabled = true;
        value.disabled = true;
        sendRegValButton.disabled = true;
    }
}

async function sendBtnClick() {
    await writeToPort(input.value);
    input.value = '';
}

async function sendRegValBtnClick() {
    await writeToPort(formatBinary(register.value, value.value));
    register.value = '';
    value.value = '';
}

async function writeToPort(data) {
    const writer = port.writable.getWriter();
    try {
        const dataArrayBuffer = new Uint8Array([data]);
        await writer.write(dataArrayBuffer);
    } catch (error) {
        log.textContent = `Write error: ${error}`;
    } finally {
        writer.releaseLock();
    }
}

function formatBinary(register, value) {
    // you can modify this function to suit your binary data formatting needs
    const registerNum = parseInt(register);
    const valueNum = parseInt(value);
    return (registerNum << 8) | valueNum;
}
