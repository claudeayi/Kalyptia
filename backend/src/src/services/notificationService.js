// Service centralisé de notifications Socket.io

/**
 * Envoi d’une notification (broadcast global)
 * @param {Express} app - L’application Express
 * @param {string} event - Nom de l’événement (ex: "DATASET_CREATED")
 * @param {object} payload - Données envoyées aux clients
 */
export function sendNotification(app, event, payload) {
  const io = app.get("io");
  if (io) {
    io.emit(event, payload);
    console.log(`📢 Notification envoyée: ${event}`, payload);
  }
}

/**
 * Envoi d’une notification ciblée à un utilisateur précis
 * @param {Express} app - L’application Express
 * @param {string|number} userId - Identifiant utilisateur (lié au socket)
 * @param {string} event - Nom de l’événement
 * @param {object} payload - Données envoyées
 */
export function sendNotificationToUser(app, userId, event, payload) {
  const io = app.get("io");
  if (io) {
    io.to(`user_${userId}`).emit(event, payload);
    console.log(`📢 Notification envoyée à l’utilisateur ${userId}: ${event}`, payload);
  }
}

/**
 * Attacher un utilisateur à une "room" socket (à appeler côté backend quand l’utilisateur se connecte)
 * @param {Socket} socket - Socket.io client
 * @param {string|number} userId - Identifiant utilisateur
 */
export function registerUserSocket(socket, userId) {
  socket.join(`user_${userId}`);
  console.log(`✅ Socket ${socket.id} enregistré pour l’utilisateur ${userId}`);
}
