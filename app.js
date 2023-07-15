 document.addEventListener('DOMContentLoaded', (event) => {
    const connectButton = document.getElementById('connect');
    const disconnectButton = document.getElementById('disconnect');
    const baudRate = document.getElementById('baudrate');
    const log = document.getElementById('log');
    const input = document.getElementById('input');
    const sendButton = document.getElementById('send');
    const register = document.getElementById('register');
    const value = document.getElementById('value');
    const sendRegValButton = document.getElementById('sendRegVal');

    let port, reader, writer;

    connectButton.addEventListener('click', async () => {
        port = await navigator.serial.requestPort();
        await port.open({ baudrate: parseInt(baudRate.value) });

        let decoder = new TextDecoderStream();
        inputDone = port.readable.pipeTo(decoder.writable);
        reader = decoder.readable.getReader();

        let encoder = new TextEncoderStream();
        outputDone = encoder.readable.pipeTo(port.writable);
        writer = encoder.writable.getWriter();

        reader.read().then(processIncomingData);

        connectButton.disabled = true;
        disconnectButton.disabled = false;
        input.disabled = false;
        sendButton.disabled = false;
        register.disabled = false;
        value.disabled = false;
        sendRegValButton.disabled = false;
    });

    disconnectButton.addEventListener('click', async () => {
        await reader.cancel();
        await inputDone.catch(() => {});
        reader = null;
        inputDone = null;

        await writer.close();
        await outputDone;
        writer = null;
        outputDone = null;

        await port.close();
        port = null;

        connectButton.disabled = false;
        disconnectButton.disabled = true;
        input.disabled = true;
        sendButton.disabled = true;
        register.disabled = true;
        value.disabled = true;
        sendRegValButton.disabled = true;
    });

    sendButton.addEventListener('click', () => {
        writer.write(input.value + '\n');
        input.value = '';
    });

    sendRegValButton.addEventListener('click', () => {
        writer.write(register.value + ': ' + value.value + '\n');
        register.value = '';
        value.value = '';
    });

    function processIncomingData({ done, value }) {
        if (value) {
            log.textContent += value + '\n';
            log.scrollTop = log.scrollHeight;
            reader.read().then(processIncomingData);
        }
    }
});
