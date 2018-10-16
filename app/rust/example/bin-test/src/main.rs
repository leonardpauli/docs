extern crate image;

use image::{ImageBuffer, Rgb};

fn main() {
    println!("Hello, world!");

    let sizes: Vec<u32> = vec![16, 32, 48, 128];


    sizes.clone().into_iter().for_each(|x| {
        let img = make_image(x);
        img.save(format!("out/icon{}.png", x)).unwrap();
    });
    
}

fn make_image(size: u32) -> ImageBuffer<Rgb<u8>, Vec<u8>> {
    let mut img = ImageBuffer::<Rgb<u8>, Vec<u8>>::new(size, size);
    for x in 5..size-5 {
        for y in 5..10 {
            img.get_pixel_mut(x, y).data = [255, 255, 255];
        }
    }
    img
}
