let port;
let selectDeviceButton;
let deviceDetails;
let connectButton;
let disconnectButton;
let baudRate;
let log;
let input;
let sendButton;
let register;
let value;
let sendRegValButton;
let selectedDevice;

function setup() {
    noCanvas();

    selectDeviceButton = select('#selectDevice');
    deviceDetails = select('#deviceDetails');
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

    selectDeviceButton.mousePressed(selectDevice);
    connectButton.mousePressed(connectBtnClick);
    disconnectButton.mousePressed(disconnectBtnClick);
    sendButton.mousePressed(sendBtnClick);
    sendRegValButton.mousePressed(sendRegValBtnClick);
}

async function selectDevice() {
    try {
        selectedDevice = await navigator.usb.requestDevice({ filters: [{}] });
        let deviceInfo = `Selected device: ${selectedDevice.productName}<br>
                        Manufacturer: ${selectedDevice.manufacturerName}<br>
                        Serial number: ${selectedDevice.serialNumber}`;
        deviceDetails.html(deviceInfo);
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
    if (selectedDevice) {
        port.open(selectedDevice, parseInt(baudRate.value()));
        connectButton.attribute('disabled', '');
        disconnectButton.removeAttribute('disabled');
        input.removeAttribute('disabled');
        sendButton.removeAttribute('disabled');
        register.removeAttribute('disabled');
        value.removeAttribute('disabled');
        sendRegValButton.removeAttribute('disabled');
    } else {
        console.log("Please select a device first.");
    }
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
