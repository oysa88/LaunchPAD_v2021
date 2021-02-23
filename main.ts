radio.onReceivedNumber(function (receivedNumber) {
    LinkStatus = true
    sistSettAktiv = input.runningTime()
    if (receivedNumber == 42) {
        Oppskytning = true
    }
})
function Rearm () {
    strip.clear()
    strip.show()
    while (pins.digitalReadPin(DigitalPin.P1) == 1) {
        basic.showLeds(`
            . . . . .
            . # # # .
            . # . # .
            . # # # .
            . . . . .
            `)
        basic.showLeds(`
            . . . . .
            . # # # .
            . # # # .
            . # # # .
            . . . . .
            `)
    }
    strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    basic.pause(100)
    Initialize()
}
function StatusCheck () {
    SelfStatus = true
    if (pins.digitalReadPin(DigitalPin.P2) == 1) {
        IgniterStatus = true
        radio.sendNumber(21)
    } else {
        IgniterStatus = false
        radio.sendNumber(22)
    }
    if (pins.digitalReadPin(DigitalPin.P1) == 1) {
        ArmStatus = true
        radio.sendNumber(31)
    } else {
        ArmStatus = false
        radio.sendNumber(32)
    }
    if (SelfStatus && LinkStatus && IgniterStatus && ArmStatus) {
        Klar = true
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
    } else {
        Klar = false
        basic.showLeds(`
            # . . . #
            # # . # #
            # . # . #
            # . . . #
            # . . . #
            `)
    }
}
function NeoPixels () {
    if (SelfStatus) {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
    }
    if (LinkStatus) {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Red))
    }
    if (IgniterStatus) {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Red))
    }
    if (ArmStatus) {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Red))
    }
}
function Launch () {
    if (Klar) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        pins.digitalWritePin(DigitalPin.P16, 1)
        basic.pause(500)
        pins.digitalWritePin(DigitalPin.P16, 0)
        Rearm()
    }
}
function Initialize () {
    SelfStatus = false
    LinkStatus = false
    IgniterStatus = false
    ArmStatus = false
    Oppskytning = false
    Klar = false
    strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . # # # .
        . # . # .
        . # # # .
        . . . . .
        `)
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
        `)
    basic.showLeds(`
        # . . . #
        # # . # #
        # . # . #
        # . . . #
        # . . . #
        `)
    basic.pause(200)
}
let Klar = false
let ArmStatus = false
let IgniterStatus = false
let SelfStatus = false
let Oppskytning = false
let sistSettAktiv = 0
let LinkStatus = false
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P0, 4, NeoPixelMode.RGB)
radio.setGroup(1)
radio.setTransmitPower(7)
pins.digitalWritePin(DigitalPin.P15, 1)
let oppdateringsfrekvens = 200
Initialize()
basic.forever(function () {
    StatusCheck()
    if (pins.digitalReadPin(DigitalPin.P5) == 0) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        pins.digitalWritePin(DigitalPin.P14, 1)
        basic.pause(200)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    if (Oppskytning) {
        Launch()
    }
})
control.inBackground(function () {
    while (true) {
        radio.sendNumber(11)
        if (input.runningTime() - sistSettAktiv > 3 * oppdateringsfrekvens) {
            LinkStatus = false
        }
    }
    basic.pause(oppdateringsfrekvens)
})
