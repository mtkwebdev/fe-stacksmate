const precision = 1000000

const utils = {
  fromOnChainAmount: function (amountMicroStx) {
    try {
      amountMicroStx = parseInt(amountMicroStx, 16)
      if (typeof amountMicroStx === 'string') {
        amountMicroStx = Number(amountMicroStx)
      }
      if (amountMicroStx === 0) return 0
      amountMicroStx = amountMicroStx / precision
      return Math.round(amountMicroStx * precision) / precision
    } catch {
      return 0
    }
  },
  toOnChainAmount: function (amount) {
    try {
      amount = Math.round(amount * precision)
      return Math.round(amount * precision) / precision
    } catch {
      return 0
    }
  }
}
export default utils
