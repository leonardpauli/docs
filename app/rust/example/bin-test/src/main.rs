extern crate image;

use image::{ImageBuffer, Rgb};

const WIDTH: u32 = 10;
const HEIGHT: u32 = 10;

fn main() {
    println!("Hello, world!");

    let mut img = ImageBuffer::<Rgb<u32>>::new(WIDTH, HEIGHT);

    img.get_pixel_mut(5, 5).data = [255, 255, 255];

    img.save("img.png").unwrap();
}
