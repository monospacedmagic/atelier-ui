use crate::errors::AndroidError;
use std::process::Command;

use log::debug;

const ANDROID_TARGETS: &'static [&str] = &[
    "aarch64-linux-android",
    "armv7-linux-androideabi",
    "i686-linux-android",
];

/// Checks to see if rustup is installed
pub fn check_rustup() -> Result<(), AndroidError> {
    debug!("Checking if rustup is installed...");
    let output = Command::new("sh").arg("-c").arg("which rustup").output()?;
    if output.status.success() {
        debug!("Rustup is installed");
        return Ok(());
    }
    Err(AndroidError::RustupNotInstalled)
}

/// Attempts to install all rustup targets for Android
pub fn rustup_add_targets() -> Result<(), AndroidError> {
    debug!("Adding Android targets via Rustup...");
    for target in ANDROID_TARGETS {
        let output = Command::new("sh")
            .arg("-c")
            .arg(format!("rustup target add {}", target))
            .output()?;
        if output.status.success() {
            debug!("Installed {}", target);
        } else {
            return Err(AndroidError::CannotAddRustupTarget {
                target: target.to_string(),
            });
        }
    }
    Ok(())
}
