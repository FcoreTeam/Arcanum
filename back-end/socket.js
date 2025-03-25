async function handleConnection(socket, io) {
    socket.emit('ping', { ping: true });

    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat room: ${chatId}`);
    });

    socket.on('private_message', async (data) => {
        console.log(data);
        const { socket_id, chat_id, msg } = JSON.parse(data);
        io.to(chat_id).emit('private_message', data);
    });

    socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);
    });
} 

export { handleConnection };