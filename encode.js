import fs from "fs";

const svg = fs.readFileSync("./svg/nft.svg", "utf8");
const encoded = Buffer.from(svg).toString("base64");
console.log(encoded);
