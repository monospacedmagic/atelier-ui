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
