use std::fmt;
use std::io;

pub enum AndroidError {
    RustupNotInstalled,
    CannotAddRustupTarget { target: String },
}

impl fmt::Display for AndroidError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            AndroidError::RustupNotInstalled => write!(f, "Rustup is not installed"),
            AndroidError::CannotAddRustupTarget { ref target } => {
                write!(f, "Unable to add rustup target: {:#?}", target)
            }
        }
    }
}

impl fmt::Debug for AndroidError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{{ file: {}, line: {} }}", file!(), line!())
    }
}

impl From<io::Error> for AndroidError {
    fn from(_error: io::Error) -> Self {
        AndroidError::RustupNotInstalled
    }
}

pub enum HttpError {
    CannotProcessRequest,
    ConnectionClosed,
    FileNotFound,
    ErrorWritingToClient,
    ReceivedPartialRequest,
    ErrorParsingHttpRequest
}

impl fmt::Display for HttpError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            HttpError::CannotProcessRequest => write!(f, "Unable to process HTTP request"),
            HttpError::ConnectionClosed => write!(f, "ConnectionClosed"),
            HttpError::FileNotFound => write!(f, "File not found"),
            HttpError::ErrorWritingToClient => write!(f, "Error writing to client"),
            HttpError::ReceivedPartialRequest => write!(f, "Client only sent partial request"),
            HttpError::ErrorParsingHttpRequest => write!(f, "Error parsing http request"),
        }
    }
}

impl fmt::Debug for HttpError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{{ file: {}, line: {} }}", file!(), line!())
    }
}