self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "MoneyVerse";
  const options = {
    body: data.body || "Bạn có thông báo mới!",
    icon: data.icon || "/favicon.ico",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // 🟢 Thêm self. vào trước clients
  event.waitUntil(self.clients.openWindow("/"));
});
