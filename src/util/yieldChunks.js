module.exports = (arr, chunkSize) => [].concat.apply([],
  arr.map((e, i) => i % chunkSize ? [] : [arr.slice(i, i + chunkSize)]))
