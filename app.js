let port;
let deviceSelect;
let connectButton;
let disconnectButton;
let baudRate;
let log;
let input;
let sendButton;
let register;
let value;
let sendRegValButton;

function setup() {
    noCanvas();

    deviceSelect = select('#deviceSelect');
    connectButton = select('#connect');
    disconnectButton = select('#disconnect');
    baudRate = select('#baudrate');
    log = select('#log');
    input = select('#input');
    sendButton = select('#send');
    register = select('#register');
    value = select('#value');
    sendRegValButton = select('#sendRegVal');

    port = createSerial();

    deviceSelect.mousePressed(populateDeviceList);
    connectButton.mousePressed(connectBtnClick);
    disconnectButton.mousePressed(disconnectBtnClick);
    sendButton.mousePressed(sendBtnClick);
    sendRegValButton.mousePressed(sendRegValBtnClick);
}

async function populateDeviceList() {
    try {
        const devices = await navigator.usb.requestDevice({ filters: [{}] });
        deviceSelect.html('');
        devices.forEach(device => {
            const option = createOption(device.productName);
            option.parent(deviceSelect);
        });
    } catch (error) {
        console.error("There was an error selecting a device.", error);
    }
}

function draw() {
    let str = port.readUntil("\n");
    if (str.length > 0) {
        log.html(log.html() + str + '<br>');
        log.elt.scrollTop = log.elt.scrollHeight;
    }
}

function connectBtnClick() {
    const selectedDevice = deviceSelect.value();
    port.open(selectedDevice, parseInt(baudRate.value()));
    connectButton.attribute('disabled', '');
    disconnectButton.removeAttribute('disabled');
    input.removeAttribute('disabled');
    sendButton.removeAttribute('disabled');
    register.removeAttribute('disabled');
    value.removeAttribute('disabled');
    sendRegValButton.removeAttribute('disabled');
}

function disconnectBtnClick() {
    port.close();
    connectButton.removeAttribute('disabled');
    disconnectButton.attribute('disabled', '');
    input.attribute('disabled', '');
    sendButton.attribute('disabled', '');
    register.attribute('disabled', '');
    value.attribute('disabled', '');
    sendRegValButton.attribute('disabled', '');
}

function sendBtnClick() {
    port.write(input.value() + '\n');
    input.value('');
}

function sendRegValBtnClick() {
    port.write(register.value() + ': ' + value.value() + '\n');
    register.value('');
    value.value('');
}
