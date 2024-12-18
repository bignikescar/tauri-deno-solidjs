use std::{
    fs::{copy, create_dir, metadata},
    io::Cursor,
};

use anyhow::Result;
use sha256;
use tar::Archive;
use tempfile::tempdir;

// https://github.com/denoland/deno/releases/download/v2.1.4/deno-aarch64-apple-darwin.zip
// https://github.com/denoland/deno/releases/latest/download/deno-aarch64-apple-darwin.zip

// deno-aarch64-apple-darwin.zip
// deno-aarch64-apple-darwin.zip.sha256sum
// deno-aarch64-unknown-linux-gnu.zip
// deno-aarch64-unknown-linux-gnu.zip.sha256sum
// deno-x86_64-apple-darwin.zip
// deno-x86_64-apple-darwin.zip.sha256sum
// deno-x86_64-pc-windows-msvc.zip
// deno-x86_64-pc-windows-msvc.zip.sha256sum
// deno-x86_64-unknown-linux-gnu.zip
// deno-x86_64-unknown-linux-gnu.zip.sha256sum

// VERSION
const GITHUB_REL_LINK: &str = "https://github.com/denoland/deno/releases/latest/download/";
const VERSION: &str = "https://github.com/denoland/deno/releases/latest/";

const BINARIES_PATH: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/binaries");

fn main() {
    let _ = download_binaries();
    tauri_build::build();
}

fn download_binaries() -> Result<()> {
    if check_binaries() {
        return Ok(());
    }

    match std::env::var("TARGET") {
        Ok(platform) => match platform.as_str() {
            "aarch64-unknown-linux-gnu" => download_bin("aarch64-unknown-linux-gnu"),
            "x86_64-unknown-linux-gnu" => download_bin("x86_64-unknown-linux-gnu"),
            "x86_64-pc-windows-msvc" => download_bin("x86_64-pc-windows-msvc"),
            "x86_64-apple-darwin" => download_bin("x86_64-apple-darwin"),
            "aarch64-apple-darwin" => download_bin("aarch64-apple-darwin"),
            _ => panic!("Platform {platform} not supported"),
        },
        Err(_) => panic!("Failing acquiring target information"),
    }
}

fn check_binaries() -> bool {
    let _ = create_dir(BINARIES_PATH);
    let target_triple = std::env::var("TARGET").unwrap_or_default();
    let mut denort: String = BINARIES_PATH.to_owned() + "/denort-" + &target_triple;
    if target_triple.contains("windows") {
        denort += ".exe";
    }
    if metadata(denort).is_ok() {
        return true;
    }
    false
}

fn download_bin(arch: &str) -> Result<()> {
    let target_triple = std::env::var("TARGET")?;
    let mut decomp: Vec<u8> = Vec::new();

    let version = reqwest::blocking::get(VERSION)?
        .text()?
        .split_once("release v")
        .unwrap_or_default()
        .1
        .trim()
        .split_once(' ')
        .unwrap_or_default()
        .0
        .to_owned();

    let mut sh256url: String = GITHUB_REL_LINK.to_owned();
    sh256url.push_str("denort-");
    sh256url.push_str(&arch);
    sh256url.push_str(".zip.sha256sum");

    let sha256 = reqwest::blocking::get(sh256url)?
        .text()?
        .split_ascii_whitespace()
        .rev()
        .last()
        .unwrap_or_default()
        .to_owned();

    let mut archiveurl: String = GITHUB_REL_LINK.to_owned();
    archiveurl.push_str("denort-");
    archiveurl.push_str(&arch);
    archiveurl.push_str(".zip");
    let raw_data = reqwest::blocking::get(archiveurl)?.bytes()?;

    let tmp_dir = tempdir()?;
    let tarball_path: std::path::PathBuf = tmp_dir
        .path()
        .join(format!("denort-{version}-amd64-static"));

    // let bytes = std::fs::read(path).unwrap();  // Vec<u8>
    let hash = sha256::digest_bytes(&raw_data).to_lowercase();
    assert_eq!(hash, sha256);

    lzma_rs::xz_decompress(&mut Cursor::new(raw_data), &mut decomp)?; // unzip ?????
    Archive::new(Cursor::new(decomp)).unpack(&tmp_dir)?;

    copy(
        tarball_path.join("denort-".to_owned() + &target_triple),
        BINARIES_PATH.to_owned() + "/denort-" + &target_triple,
    )?;
    Ok(())
}
