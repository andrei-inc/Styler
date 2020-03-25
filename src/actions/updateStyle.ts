import applyStyle from './applyStyle';

// sync layer style with shared style
export default async (layer, style, styleType) => {
  const layerId = styleType.layer.id;
  const layerProp = styleType.layer.prop;
  const styleProp = styleType.style.prop;
  if (styleType.type === 'TEXT') {
    const textProp = styleType.style.textProp;
    await figma.loadFontAsync(layer.fontName);

    style[styleProp] = layer[layerProp];
    textProp.map(prop => (style[prop] = layer[prop]));
    layer[layerId] = style.id;
  } else {
    style[styleProp] = layer[layerProp];
    layer[layerId] = style.id;
  }
};
