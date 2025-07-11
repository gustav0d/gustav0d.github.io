import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import type { SatoriOptions } from 'satori';
import { og } from '../components/og';

// TODO: Improve this
const loadFonts = async () => {
  const merriweatherRegularFontFile = await fetch(
    'https://www.1001fonts.com/download/font/merriweather.regular.ttf',
  );
  const merriweatherRegularFont =
    await merriweatherRegularFontFile.arrayBuffer();

  const merriweatherBoldFontFile = await fetch(
    'https://www.1001fonts.com/download/font/merriweather.bold.ttf',
  );
  const merriweatherBoldFont = await merriweatherBoldFontFile.arrayBuffer();

  return {
    merriweatherRegularFont,
    merriweatherBoldFont,
  };
};

const { merriweatherRegularFont, merriweatherBoldFont } = await loadFonts();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: 'Merriweather',
      data: merriweatherRegularFont,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Merriweather',
      data: merriweatherBoldFont,
      weight: 700,
      style: 'normal',
    },
  ],
};

const svgBufferToPngBuffer = (svg: string) => {
  const resvg = new Resvg(svg);
  const png = resvg.render();
  return png.asPng();
};

export const GET: APIRoute = async () => {
  const svg = await satori(
    og({
      data: { title: "welcome to gustav0d's digital garden!" },
      date: false,
      tags: false,
    }),
    options,
  );
  const png = svgBufferToPngBuffer(svg);

  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
