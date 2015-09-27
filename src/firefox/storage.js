function getPreferences(defaults, callback) {
    self.port.on('preferences', callback);
}
