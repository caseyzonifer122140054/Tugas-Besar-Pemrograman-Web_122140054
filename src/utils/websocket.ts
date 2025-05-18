type MessageData = {
  event: string;
  data: any;
};

type OnMessageCallback = (data: MessageData) => void;

let socket: WebSocket | null = null;

export const connectWebSocket = (tripId: number | string, onMessage: OnMessageCallback) => {
  if (!tripId) {
    console.error("Trip ID is required to connect to WebSocket.");
    return;
  }

  socket = new WebSocket(`ws://localhost:8001/?trip_id=${tripId}`);

  socket.onopen = () => {
    console.log("WebSocket connected for trip:", tripId);
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const message: MessageData = JSON.parse(event.data);
      onMessage && onMessage(message);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };
};

export const sendMessage = (data: object) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn("WebSocket not connected.");
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
