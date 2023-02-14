function load({ params }) {
  return {
    alias: params.slug,
    id: 1,
    name: "Some File",
    dataType: "image/png",
    data: "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
  };
}
export {
  load
};
