const places = [
  ['waterloo', 167959],
  ['toronto', 75821],
  ['markham', 28073],
  ['scarborough', 25705],
  ['mississauga', 19986],
  ['north york', 14057],
  ['fairview', 13227],
  ['pearson', 8681],
  ['brampton', 6773],
  ['london', 4015],
  ['ottawa', 3354],
  ['vaughan', 3188],
  ['kitchener', 2748],
  ['hamilton', 2662],
  ['etobicoke', 1763],
  ['oakville', 1530],
  ['guelph', 1371],
  ['kingston', 1328],
  ['richmond hill', 1180],
  ['newmarket', 618],
  ['thornhill', 584],
  ['bayview', 501],
]

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const processed = places.map(tuple => {
  const place = tuple[0]
  return toTitleCase(place);
})

console.log(processed)
