export default {
  bearing: function(lat1, lng1, lat2, lng2) {
    var dLon = this._toRad(lng2 - lng1);
    var y = Math.sin(dLon) * Math.cos(this._toRad(lat2));
    var x =
      Math.cos(this._toRad(lat1)) * Math.sin(this._toRad(lat2)) -
      Math.sin(this._toRad(lat1)) *
        Math.cos(this._toRad(lat2)) *
        Math.cos(dLon);
    var brng = this._toDeg(Math.atan2(y, x));
    console.log('bearing:', brng);
    return (brng + 360) % 360;
  },

  /**
   * Since not all browsers implement this we have our own utility that will
   * convert from degrees into radians
   *
   * @param deg - The degrees to be converted into radians
   * @return radians
   */
  _toRad: function(deg) {
    return (deg * Math.PI) / 180;
  },

  /**
   * Since not all browsers implement this we have our own utility that will
   * convert from radians into degrees
   *
   * @param rad - The radians to be converted into degrees
   * @return degrees
   */
  _toDeg: function(rad) {
    return (rad * 180) / Math.PI;
  }
};
