async function handleConnection(socket, io) {
    socket.emit('ping', { ping: true });

    socket.on('join_chat', (chatId) => {
        socket.join(chatId); // Присоединяемся к комнате чата
        console.log(`User ${socket.id} joined chat room: ${chatId}`);
    });

    socket.on('private_message', async (data) => {
        const { chat_id, msg } = data;
        console.log(`Sending message to chat ${chat_id}: ${msg}`); // Логирование
        try {
            io.to(chat_id).emit('private_message', {chat_id, msg});
        } catch (error) {
            console.error(error);
            socket.emit('error', { success: false, message: 'Ошибка при запросе данных пользователя' });
            return;
        }
    });

    socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);
    });
} 

export { handleConnection };