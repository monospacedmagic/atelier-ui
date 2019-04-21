use log::{debug, error, info};
use std::{net::SocketAddr, thread};
use websocket::sync::Server;

mod android;
mod command_handler;
mod commands;
mod constants;
mod errors;

fn main() {
    // Setup the bind string for the server. This will eventually be customizable.
    let bind_string = constants::WS_HOST.to_owned() + ":" + constants::WS_PORT;
    info!("Server starting on: {:?}", bind_string);
    // For now, we'll handle each client in one thread. For now, there should not be many clients connecting.
    // The main one will be the graphical frontend that sends requests back.
    if let Ok(server) = Server::bind(bind_string) {
        for request in server.filter_map(Result::ok) {
            // Spawn a new thread for each connection.
            thread::spawn(move || {
                // Hold on to the connected client's IP for later use
                let ip: SocketAddr;
                // Attempt to accept the connection, giving us a client
                match request.accept() {
                    Ok(client) => {
                        // If all goes well, we'll get their IP and store it
                        match client.peer_addr() {
                            Ok(cip) => {
                                ip = cip;
                                debug!("Connection from {}", ip);
                            }
                            // If not, print an error and return, killing the thread
                            Err(e) => {
                                error!("Error getting peer address: {:?}", e);
                                return;
                            }
                        };
                        // Here we split the client into a sender and receiver channel
                        match client.split() {
                            Ok((mut receiver, mut sender)) => {
                                // On the receiver side, we'll iterate over each incoming message and handle it
                                for message in receiver.incoming_messages() {
                                    if let Err(e) = message {
                                        error!(
                                            "There was an error processing incoming message: {:?}",
                                            e
                                        );
                                        continue;
                                    }

                                    sender = command_handler::Processor::handle_command(
                                        sender,
                                        message.unwrap(),
                                    );
                                }
                            }
                            Err(e) => {
                                // If we made it here, there was an error creating the channels, so we need to
                                // print the error and exit since we can't do anything without channels.
                                error!(
                                    "There was an error creating send and recv channels: {:?}",
                                    e
                                );
                                return;
                            }
                        };
                    }
                    Err(e) => {
                        // If we made it here, there was an error accepting the client, so we need to print
                        // the error and exit since we can't do anything else.
                        error!("There was an error accepting the client: {:?}", e);
                        return;
                    }
                }
            });
        }
    }
}
