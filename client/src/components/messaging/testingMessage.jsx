import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000');

function testingMessage() {

    const [messageData, setMessageData] = useState('');
    const [messageDataRecevied, setMessageDataRecevied] = useState('');
    const [room, setRoom] = useState(0);

    const joinRoom = (e)=>{

        if(room !== 0){

            socket.emit('join_room', room);
        }
    }

    const sendMessage = (e)=>{
        socket.emit('send_message', {message : messageData});
    }

    useEffect(()=>{

        socket.on('receive_message', (data)=>{

            setMessageDataRecevied(data.message);
        })
    }, [socket])


    return (
        <div>
            <input placeholder='Message...'
                    name='message'
                    onChange={(e)=>{
                        setMessageData(e.target.value)
                        
                    }}></input>
            <button onClick={sendMessage}>Send Message</button>
            <br/>
            <h1>
                {messageDataRecevied}
            </h1>
        </div>
    )
}

export default testingMessage;