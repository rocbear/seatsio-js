const utilities = require('../utilities.js')

class HoldTokens {
  constructor (client) {
    this.client = client
  }

  /**
   * @param {?number} expiresInMinutes
   * @returns {Promise<HoldToken>} Promise object that will resolve to HoldToken object
   */
  create (expiresInMinutes = null) {
    let request = {}
    if (expiresInMinutes !== null) {
      request.expiresInMinutes = expiresInMinutes
    }
    return this.client.post('/hold-tokens', request).then((res) => utilities.createHoldToken(res.data))
  }

  /**
   * @param {string} holdToken
   * @param {number} minutes
   * @returns {Promise<HoldToken>} Promise object that will resolve to HoldToken object
   */
  expiresInMinutes (holdToken, minutes) {
    let request = {}
    request.expiresInMinutes = minutes
    return this.client.post(`/hold-tokens/${holdToken}`, request).then((res) => utilities.createHoldToken(res.data))
  }

  /**
   * @param {string} holdToken
   * @returns {Promise<HoldToken>} Promise object that will resolve to HoldToken object
   */
  retrieve (holdToken) {
    return this.client.get(`/hold-tokens/${holdToken}`).then((res) => utilities.createHoldToken(res.data))
  }
}

module.exports = HoldTokens
