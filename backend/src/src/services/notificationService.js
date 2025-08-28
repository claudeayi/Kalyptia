export function sendNotification(app, event, payload) {
  const io = app.get("io");
  if (io) {
    io.emit(event, payload);
    console.log(`📢 Notification envoyée: ${event}`, payload);
  }
}
