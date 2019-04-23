//! This module contains a very basic HTTP server that exists to bootstrap the web_view by serving the needed files

use std::io::Read;
use std::net::{TcpListener, TcpStream};
use std::time::Duration;
use std::path::PathBuf;
use std::io;
use std::io::prelude::*;
use std::fs::File;
use std::thread;

use log::{info, debug, warn, error};
use httparse;

use crate::errors;

const VERBS: [&'static str; 9] = ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"];

#[derive(Debug)]
enum FileExtension {
    HTML,
    CSS,
    JS,
    WASM,
    Other
}

/// Basic HTTP Server, just stores a host and port string for binding
pub struct HttpServer {
    host: String,
    port: String,
    static_file_root: String
}

impl HttpServer {
    pub fn new(host: String, port: String, static_file_root: String) -> HttpServer {
        HttpServer {
            host,
            port,
            static_file_root
        }
    }

    /// Starts the main loop of the HTTP server. This is meant only to accept requests from the local front-end, so it does not do anything
    /// fancy with respect to thread pools, futures, etc.
    pub fn run(&mut self) {
        info!("Starting HTTP server on {}:{}", self.host, self.port);
        const READ_TIMEOUT_MS: u64 = 20;
        let listener = TcpListener::bind(self.host.clone() + ":" + &self.port).expect("Cannot start TcpListener");
        loop {
            for stream in listener.incoming().next().unwrap() {
                thread::spawn(move || {
                    debug!("New client connected: {:#?}", stream);
                    if let Err(e) = stream.set_read_timeout(Some(Duration::from_millis(READ_TIMEOUT_MS))) {
                        error!("There was an error setting the read timeout on a client: {:#?}", e);
                    }
                    if let Err(e) = HttpServer::handle_client(stream) {
                        error!("There was an error handling a client: {:#?}", e);
                    }
                });
            }
        }
    }

    // Handles a client's HTTP request. This should only ever be for static files, and should only come from the same host as the front-end
    // is running on.
    fn handle_client(mut client: TcpStream) -> Result<(), errors::HttpError> {
        // Buffer we'll use to read in the request data
        let mut buf = vec![];
        // We'll allow space for 4 headers
        let mut headers = [httparse::EMPTY_HEADER; 16];
        // Create an empty request with the space for headers
        let mut request = httparse::Request::new(&mut headers);
        
        // Here we need to loop until the client stops sending data, or we receive a WouldBlock error from the OS. This means we should try
        // to parse the data we've received into an HTTP request.
        loop {
            match client.read_to_end(&mut buf) {
                Ok(0) => {
                    debug!("Received 0 bytes from client");
                    break;
                },
                Ok(n) => {
                    debug!("Read {:#?} bytes from client", n);
                    continue;
                }
                Err(e) => {
                    if e.kind() == std::io::ErrorKind::WouldBlock {
                        debug!("Hit WouldBlock error, breaking from loop");
                        break;
                    } else {
                        error!("Error: {:#?}", e);
                        return Ok(())
                    }
                }
            }
        }
        // Now we try to parse the request with the data we've gathered so far from the client. If we have a Complete request, we can process it,
        // if not, we just exit. Future versions should go back to trying to collect data from the client.
        match request.parse(&buf) {
            Ok(status) => {
                if status.is_complete() {
                    match request.method.unwrap() {
                        // We only care about a GET request
                        "GET" => {
                            // We'll do basic tokenization of the URL path
                            let tokenized_path: Vec<&str> = request.path.unwrap().split("/").collect();
                            let mut buf = vec![];
                            HttpServer::generate_version(&mut buf);
                            // We know that we only a URL that looks like:
                            // <static directory name>/filename
                            // This ends up being 3 parts when we split it
                            // We can disallow anything else, which is helpful for security
                            if tokenized_path.len() != 3 {
                                // We're going to return a 404 for anything that can't possibly be a valid request
                                HttpServer::generate_code(&mut buf, 404);
                                let response = HttpServer::generate_response(&mut buf);
                                // Write it back to the client and return
                                match client.write_all(&response) {
                                    Ok(_) => {
                                        debug!("Write 404 to client that asked for path: {:#?}", request.path.unwrap());
                                        return Ok(())
                                    },
                                    Err(e) => {
                                        error!("Error writing a 404 to client: {:#?}", e);
                                        return Err(errors::HttpError::FileNotFound);
                                    }
                                }
                            } else {
                                
                                // Here we handle the case of a proper request for a file
                                let path = String::from(tokenized_path[1].to_string()+"/"+tokenized_path[2]);
                                let bytes = HttpServer::load_file(&path);
                                if let Err(e) = bytes {
                                    error!("Error loading bytes from file: {:#?} at {:#?}", e, path);
                                    return Err(errors::HttpError::FileNotFound);
                                }
                                
                                let ext = HttpServer::extract_file_extension(tokenized_path[2]);
                                HttpServer::generate_code(&mut buf, 200);
                                HttpServer::generate_content_type(&mut buf, ext);
                                let mut response = HttpServer::generate_response(&mut buf);
                                for byte in bytes.unwrap() {
                                    response.push(byte);
                                }

                                match client.write_all(&response) {
                                    Ok(_) => {
                                        debug!("Write 200 to client that asked for path: {:#?}", request.path.unwrap());
                                        return Ok(())
                                    },
                                    Err(e) => {
                                        error!("Error writing a 200 to client: {:#?}", e);
                                        return Err(errors::HttpError::ErrorWritingToClient);
                                    }
                                }
                            }
                        },
                        _ => {
                            warn!("Client tried to use an unsupported method: {:#?}", request.method.unwrap());
                            return Ok(());
                        }
                    }
                } else {
                    error!("Only received a Partial request from client");
                    return Err(errors::HttpError::ReceivedPartialRequest);
                }
            },
            Err(e) => {
                error!("Error parsing http: {:#?}", e);
                return Err(errors::HttpError::ErrorParsingHttpRequest);
            }
        }
    }

    fn generate_version(buf: &mut Vec<u8>) {
        buf.append(&mut b"HTTP/1.1 ".to_vec());
    }

    fn generate_code(buf: &mut Vec<u8>, code: usize) {
        match code {
            200 => {
                buf.append(&mut b"200 OK\r\n".to_vec());
            },
            404 => {
                buf.append(&mut b"404 NOTFOUND\r\n".to_vec());
            },
            _ => {}
        }
    }

    fn generate_content_type(buf: &mut Vec<u8>, ext: FileExtension) {
        debug!("Generating content type for: {:#?}", ext);
        match ext {
            FileExtension::HTML => {
                buf.append(&mut b"Content-Type: text/html\r\n".to_vec());
            },
            FileExtension::CSS => {
                buf.append(&mut b"Content-Type: text/css\r\n".to_vec());
            }
            FileExtension::JS => {
                buf.append(&mut b"Content-Type: application/javascript\r\n".to_vec());
            },
            FileExtension::WASM => {
                buf.append(&mut b"Content-Type: application/wasm\r\n".to_vec());
            },
            FileExtension::Other => {
                buf.append(&mut b"Content-Type: application/octet-stream\r\n".to_vec());
            }
        }
    }

    fn generate_response(buf: &mut Vec<u8>) -> Vec<u8> {
        let mut headers = [httparse::EMPTY_HEADER; 4];
        let mut response = httparse::Response::new(&mut headers);
        match response.parse(buf) {
            Ok(_) => {
                buf.to_vec();
                buf.append(&mut b"Access-Control-Allow-Origin: *\r\n\r\n".to_vec());
                buf.to_vec()
            },
            Err(e) => {
                error!("Error: {:#?}", e);
                vec![]
            }
        }
    }

    fn load_file(path: &str) -> io::Result<Vec<u8>> {
        let path = PathBuf::from(path);
        let f = File::open(path)?;
        let mut bytes = vec![];
        for byte in f.bytes() {
            bytes.push(byte.unwrap());
        }
        Ok(bytes)
    }

    fn extract_file_extension(path: &str) -> FileExtension {
        let extension: Vec<&str> = path.split(".").collect();
        debug!("Extracting extension: {:#?}", extension);
        match extension[1] {
            "css" => {
                FileExtension::CSS
            },
            "js" => {
                FileExtension::JS
            },
            "html" => {
                FileExtension::HTML
            },
            "wasm" => {
                FileExtension::WASM
            },
            _ => {
                FileExtension::Other
            }
        }

    }
}

#[cfg(test)]
mod tests {


}