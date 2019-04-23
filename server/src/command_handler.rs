use log::{debug, info};
use std::net::TcpStream;

use websocket::{sender::Writer, OwnedMessage};

pub struct Processor {}

impl Processor {
    pub fn handle_command(
        mut sender: Writer<TcpStream>,
        message: websocket::OwnedMessage,
    ) -> Writer<TcpStream> {
        match message {
            OwnedMessage::Close(_) => {
                let message = OwnedMessage::Close(None);
                sender.send_message(&message).unwrap();
            }
            OwnedMessage::Ping(ping) => {
                let message = OwnedMessage::Pong(ping);
                sender.send_message(&message).unwrap();
            }
            OwnedMessage::Text(payload) => {
                info!("Received text payload: {:?}", payload);
                let mut split = Processor::parse_command(payload);
                let command = split.remove(0);
                Processor::dispatch(command, split);
            }
            _ => sender.send_message(&message).unwrap(),
        }
        sender
    }

    // Parses a simple command string from the client
    fn parse_command(command: String) -> Vec<String> {
        let lines = command.split("/");
        lines.into_iter().map(|s| String::from(s)).collect()
    }

    fn dispatch(command: String, args: Vec<String>) {
        match command {
            _ => {
                debug!("Received: {:#?}", args);
            }
        }
    }
}
